from sortedcontainers import SortedList

class SortedKV:
    def __init__(self):
        # (value, key) 로 정렬되는 리스트
        self._list = SortedList()
        # 키로 바로 값에 접근하기 위한 맵
        self._map  = {}

    def add(self, key, value):
        """새로운 key를 추가하거나, 기존 key라면 값을 덮어씌움."""
        if key in self._map:
            self._list.remove((self._map[key], key))
        print(f"ADDING    → key={key!r}, value={value}")
        self._map[key] = value
        self._list.add((value, key))
        self._debug_state()

    def set_value(self, key, new_value):
        """key의 값을 new_value로 변경(없으면 새로 추가)."""
        old = self._map.get(key)
        if old is not None:
            self._list.remove((old, key))
            print(f"SET_VALUE → key={key!r}, {old} → {new_value}")
        else:
            print(f"SET_VALUE → key={key!r} (new) → {new_value}")
        self._map[key] = new_value
        self._list.add((new_value, key))
        self._debug_state()

    def increment(self, key, delta=1):
        """key의 값을 delta만큼 증가(없으면 0에서 시작)."""
        old = self._map.get(key, 0)
        if key in self._map:
            self._list.remove((old, key))
        new = old + delta
        self._map[key] = new
        self._list.add((new, key))
        print(f"INCREMENT → key={key!r}, {old} → {new}")
        self._debug_state()
        return new

    def pop_max(self):
        """가장 큰 value 항목 제거 후 반환."""
        v, k = self._list.pop(-1)
        print(f"POP_MAX   → key={k!r}, value={v}")
        del self._map[k]
        self._debug_state()
        return k, v

    def pop_above(self, threshold):
        """value ≥ threshold 인 모든 항목 제거 후 리스트로 반환."""
        print(f"\nPOP_ABOVE threshold={threshold}")
        idx = self._list.bisect_left((threshold, ""))
        removed = self._list[idx:]
        for v, k in removed:
            del self._map[k]
        del self._list[idx:]
        result = [(k, v) for v, k in removed]
        print(f"  removed items: {result}")
        self._debug_state()
        return result

    def reset(self):
        """모든 항목을 제거하고 초기 상태로 리셋."""
        print("RESET      → clearing all items")
        self._list.clear()
        self._map.clear()
        self._debug_state()

    def _debug_state(self):
        """현재 (key, value) 리스트 상태 출력."""
        print("  current  →", [(k, v) for v, k in self._list])
        print("-" * 60)


# ----------------------------
# 실행 예시
# ----------------------------
if __name__ == "__main__":
    store = SortedKV()

    # 1) 초기 항목 추가
    store.add("apple", 15)
    store.add("banana", 5)
    store.add("cherry", 25)

    # 2) 값 갱신
    store.set_value("banana", 12)
    store.increment("apple", 3)

    # 3) pop_max, pop_above
    store.pop_max()
    store.pop_above(10)

    # 4) 리셋
    store.reset()

    # 5) 리셋 후 다시 추가
    store.add("date", 7)
    store.pop_max()
