#!/usr/bin/env python3
import sys
import asyncio
import json
import time
import heapq
from datetime import datetime, timedelta
from collections import deque, defaultdict

import aiomqtt
import aiohttp

override_mode: str | None = None

# API 설정
API_URL_DH = "https://c203ur.duckdns.org/api/attendance/create"
API_HEADERS = {
    "Authorization": "ApiKey c203raspberry",
    "Content-Type": "application/json",
}

# MQTT 설정
BROKER = "192.168.100.214"
PORT = 1883
TOPIC = "pub_msg"
ALERT_TOPIC = "alert_topic"

# 동시 API 호출 제한
api_semaphore = asyncio.Semaphore(5)

# 매칭용 큐 & 맵
TIME_WINDOW = 10.0
MAX_QUEUE_SIZE = 50
face_q = deque(maxlen=MAX_QUEUE_SIZE)
object_q = deque(maxlen=MAX_QUEUE_SIZE)
hmap = defaultdict(set)           # name → set(objects)
hmap_visited = defaultdict(bool)  # name → bool

# 퇴실 스케줄 등록 플래그
departure_scheduled: set[str] = set()
# 퇴실 완료 플래그
departure_done: set[str] = set()

# 퇴실 스케줄 힙
timer_heap: list[tuple[float, str]] = []

# 공유 자원 보호용 lock
data_lock = asyncio.Lock()

# 등/하원 시간 설정 (HH:MM)
ARRIVAL_START = "09:48"
ARRIVAL_END   = "09:50"
DEPARTURE_END = "18:30"

def parse_hm(hm: str):
    h, m = map(int, hm.split(":"))
    return h, m

ARR_SH, ARR_SM = parse_hm(ARRIVAL_START)
ARR_EH, ARR_EM = parse_hm(ARRIVAL_END)
DEP_EH, DEP_EM = parse_hm(DEPARTURE_END)

def now_dt(ts=None):
    return datetime.fromtimestamp(ts or time.time())

def in_arrival_window(ts):
    if override_mode is not None:
        return override_mode == "arrival"
    d = now_dt(ts)
    start = d.replace(hour=ARR_SH, minute=ARR_SM, second=0, microsecond=0)
    end   = d.replace(hour=ARR_EH, minute=ARR_EM, second=0, microsecond=0)
    return start <= d < end

def in_departure_window(ts):
    if override_mode is not None:
        return override_mode == "departure"
    d = now_dt(ts)
    start = d.replace(hour=ARR_EH, minute=ARR_EM, second=0, microsecond=0)
    end   = d.replace(hour=DEP_EH, minute=DEP_EM, second=0, microsecond=0)
    return start <= d < end

async def call_api_dh(child_name: str, stuff_list: list[str] = []):
    """등원/하원 API 호출 (stuff_list를 전달)"""
    now_ts = time.time()
    type_str = "AM" if in_arrival_window(now_ts) else "PM"
    async with api_semaphore:
        async with aiohttp.ClientSession(headers=API_HEADERS) as sess:
            async with sess.post(
                API_URL_DH,
                json={
                    "childName": child_name,
                    "stuffList": stuff_list,
                    "type": type_str
                },
            ) as resp:
                text   = await resp.text()
                status = resp.status
        print(f"[ATTEND {status}] {child_name} ({type_str}) → {stuff_list} / {text.strip()}")

async def clear_hmap_at(hour: int, minute: int, label: str, clear_visited: bool):
    """매일 지정 시각에 hmap_* 초기화"""
    while True:
        now = datetime.now()
        nxt = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if now >= nxt:
            nxt += timedelta(days=1)
        await asyncio.sleep((nxt - now).total_seconds())
        async with data_lock:
            hmap_visited.clear()
            if clear_visited:
                hmap.clear()
                departure_scheduled.clear()
                departure_done.clear()
        what = "hmap_visited" + (" + hmap" if clear_visited else "")
        print(f"[RESET {label} at {datetime.now():%Y-%m-%d %H:%M:%S}] cleared {what}")

def try_match():
    """face_q, object_q 내 윈도우 매칭"""
    now_ts = time.time()
    # 오래된 face 이벤트 제거
    while face_q and now_ts - face_q[0][1] > TIME_WINDOW:
        face_q.popleft()
    # 오래되었거나 빈 objs 이벤트 제거
    while object_q and (now_ts - object_q[0][1] > TIME_WINDOW or not object_q[0][0]):
        object_q.popleft()

    # 가능한 모든 페어 순회
    for name, t1 in list(face_q):
        for objs, t2 in list(object_q):
            if name and objs and abs(t1 - t2) <= TIME_WINDOW:
                asyncio.create_task(_do_match_or_unmatch(name, objs))
                face_q.remove((name, t1))
                object_q.remove((objs, t2))
                return

async def _do_match_or_unmatch(child_name: str, objs):
    """로컬 hmap 업데이트"""
    # 한 번 퇴실 완료된 아이는 무시
    if child_name in departure_done:
        return

    # objs 정리
    if isinstance(objs, str):
        stuff_list = [s.strip() for s in objs.split(",") if s.strip()]
    elif isinstance(objs, list):
        stuff_list = objs
    else:
        stuff_list = [objs]

    async with data_lock:
        now_ts = time.time()
        if in_arrival_window(now_ts):
            new = [o for o in stuff_list if o not in hmap[child_name]]
            if new:
                hmap[child_name].update(new)
                print(f"[LOCAL MATCH] +{child_name}: {new}")
        elif in_departure_window(now_ts):
            gone = [o for o in stuff_list if o in hmap[child_name]]
            if gone:
                for o in gone:
                    hmap[child_name].remove(o)
                print(f"[LOCAL UNMATCH] –{child_name}: {gone}")

def schedule_departure(name: str, delay: int):
    """퇴실 예약을 timer_heap에 추가"""
    due = time.time() + delay
    heapq.heappush(timer_heap, (due, name))
    print(f"[SCHEDULE] {name} leftover check at {datetime.fromtimestamp(due):%H:%M:%S}")

async def timer_worker():
    """만료된 퇴실 이벤트 처리"""
    while True:
        if not timer_heap:
            await asyncio.sleep(1)
            continue

        due, name = timer_heap[0]
        now = time.time()
        if now < due:
            await asyncio.sleep(due - now)
            continue

        expired = []
        while timer_heap and timer_heap[0][0] <= now:
            _, nm = heapq.heappop(timer_heap)
            expired.append(nm)

        for nm in expired:
            await check_leftover(nm)

async def check_leftover(name: str):
    """퇴실 후 예약된 시간 경과 뒤 최종 잔여물 API 호출"""
    # 이미 완료된 아이면 스킵
    if name in departure_done:
        print(f"[SKIP] {name} 이미 퇴실 처리됨")
        return

    async with data_lock:
        leftover = list(hmap.get(name, []))
    await call_api_dh(name, leftover)
    # 호출 완료 후 마킹
    departure_done.add(name)

async def alert_via_mqtt(msg: dict):
    async with aiomqtt.Client(hostname=BROKER, port=PORT) as client:
        await client.publish(ALERT_TOPIC, json.dumps(msg))

async def mqtt_handler():
    """MQTT 구독 & 메시지 처리"""
    async with aiomqtt.Client(hostname=BROKER, port=PORT) as client:
        await client.subscribe(TOPIC)
        async for msg in client.messages:
            data = json.loads(msg.payload.decode())
            ts, name, objs = data["time"], data["name"], data["objects"]

            # 이미 완료된 아이는 무시
            if name in departure_done:
                print(f"[SKIP] {name} has already departed, ignore message")
                continue

            face_q.append((name, ts))
            object_q.append((objs, ts))

            # API 호출 로직: 입실 즉시, 하원은 10초 뒤 스케줄러에서 처리
            async with data_lock:
                if not hmap_visited[name] and in_arrival_window(ts):
                    hmap_visited[name] = True
                    asyncio.create_task(call_api_dh(name, []))
                elif not hmap_visited[name] and in_departure_window(ts):
                    hmap_visited[name] = True
                    departure_scheduled.add(name)
                    schedule_departure(name, delay=10)

            try_match()
            print(f"[RECV] {msg.topic} → {data}")

async def manual_mode_listener():
    """터미널 키입력으로 override_mode 설정"""
    global override_mode
    loop = asyncio.get_event_loop()
    print(">>> 'a' → 입실, 'd' → 퇴실, 't' → 시간 기반 복귀")
    while True:
        line = await loop.run_in_executor(None, sys.stdin.readline)
        key = line.strip().lower()
        if key == "a":
            override_mode = "arrival"
            print("=== 수동 모드:[입실] ===")
        elif key == "d":
            override_mode = "departure"
            print("=== 수동 모드:[퇴실] ===")
            hmap_visited.clear()
            departure_scheduled.clear()
            departure_done.clear()
            print("=== hmap_visited, departure_scheduled & departure_done 클리어 ===")
        elif key == "t":
            override_mode = None
            print("=== 시간 기반 모드 복귀 ===")
        else:
            print("잘못된 입력: 'a', 'd', 't' 중 하나를 눌러주세요.")

async def main():
    # ARRIVAL_END 이후엔 hmap_visited만, DEPARTURE_END 이후엔 hmap 전체 초기화
    asyncio.create_task(clear_hmap_at(ARR_EH, ARR_EM, "ARRIVAL_END", clear_visited=False))
    asyncio.create_task(clear_hmap_at(DEP_EH, DEP_EM, "DEPARTURE_END", clear_visited=True))
    asyncio.create_task(timer_worker())
    asyncio.create_task(manual_mode_listener())
    await mqtt_handler()

if __name__ == "__main__":
    asyncio.run(main())
