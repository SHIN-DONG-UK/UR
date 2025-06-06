import os
os.environ["TF_LITE_USE_XNNPACK"] = "false"
import cv2
import numpy as np
import mediapipe as mp
import sqlite3
import pickle
from typing import Optional, Tuple
from utils.face_align import norm_crop
from utils.hailo_face_embedder import HailoFaceEmbedder
# from utils.face_embedder import HailoFaceEmbedder
import collections
import requests

# Paths
MODEL_DIR = "./model/"
DB_PATH = "face_db.sqlite"
# URL
API_URL = "https://c203ur.duckdns.org/api/face-embedding/select/init-data"
API_HEADERS = {
    "Authorization": "ApiKey c203raspberry",
    "Content-Type":  "application/json",
}

class FaceRecognizer:
    """
    실시간 영상에서 다수 얼굴을 감지해 embedding 생성 후
    내장 DB로부터 brute-force 매칭을 수행합니다.
    """
    # MediaPipe FaceMesh 5포인트 인덱스
    KP = {
        "LE": 468,  # left eye pupil centre
        "RE": 473,  # right eye pupil centre
        "Nose": 1,  # nose tip
        "LM": 61,   # left mouth corner
        "RM": 291   # right mouth corner
    }

    def __init__(
        self,
        model_dir: str,
        db_path: str,
        image_size: int = 112,
        similarity_threshold: float = 0.8,
        cache_size: int = 20
    ):
        # # cache
        # self.cache_size = cache_size
        # # 이름 → (emb, last_seen_frame)  순서가 보장되는 캐시
        # self.recent_cache: collections.OrderedDict[str, Tuple[np.ndarray, int]] = \
        #     collections.OrderedDict()

        # self.frame_idx = 0           # 전체 프레임 번호 (recognize_frame 호출될 때마다 +1)
        
        self.image_size = image_size
        hef_path = model_dir + "arcface_mobilefacenet.hef"
        self.embedder = HailoFaceEmbedder(hef_path)
        self.similarity_threshold = similarity_threshold

        #################### DB에서 embedding 호출 ######################################
        # 1) API 호출
        resp = requests.get(API_URL, headers=API_HEADERS)
        resp.raise_for_status()
        payload = resp.json()
        records = payload["result"]["embeddingList"]
        # 2) JSON → 파이썬 리스트(이름, np.ndarray) 변환
        self.face_list = []
        for rec in records:
            name       = rec["childName"]
            float_list = rec["embedding"]                # list[float]
            emb        = np.array(float_list, dtype=np.float32)
            self.face_list.append((name, emb))
        #################################################################################

        #################### Local Test DB ########################################
        # # DB 연결 및 임베딩 로드 (정규화 제거)
        # self.conn = sqlite3.connect(db_path)
        # self.cursor = self.conn.cursor()
        # self.face_list: list[Tuple[str, np.ndarray]] = []
        # for name, emb_blob in self.cursor.execute(
        #         "SELECT name, embedding FROM face_embeddings"):
        #     emb = pickle.loads(emb_blob).astype(np.float32)
        #     # 👉 원본 임베딩을 그대로 사용합니다.
        #     self.face_list.append((name, emb))
        #################################################################################

        # timestamp for mediapipe 영상 모드
        self._timestamp = 0
        
        # MediaPipe FaceLandmarker (VIDEO 모드)
        lm_task_path = model_dir + "face_landmarker.task"
        options = mp.tasks.vision.FaceLandmarkerOptions(
            base_options=mp.tasks.BaseOptions(model_asset_path=lm_task_path),
            running_mode=mp.tasks.vision.RunningMode.VIDEO,
        )
        self.landmarker = mp.tasks.vision.FaceLandmarker.create_from_options(options)

    def find_most_similar(self, query_emb: np.ndarray) -> Tuple[Optional[str], float]:
        best_score = -1.0
        best_name = None

        # # ① 최근 캐시부터
        # for name, (emb, _) in self.recent_cache.items():
        #     score = float(np.dot(query_emb, emb))

        #     if score > best_score:
        #         best_score, best_name = score, name
        #     # 캐시만 뒤져도 threshold 넘으면 바로 반환 → 매우 빠름
        #     if best_score >= self.similarity_threshold:
        #         # print("cache hit!")
        #         return best_name, best_score
        
        # 캐시 없으면 전체 DB 탐색
        for name, emb in self.face_list:
            score = float(np.dot(query_emb, emb))
            if score > best_score:
                best_score = score
                best_name = name

        if best_score >= self.similarity_threshold:
            return best_name, best_score
        
        return None, best_score

    def recognize_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, str, Tuple[int,int,int,int]]:
        name = ''
        h, w = frame.shape[:2]

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)     # BGR to RGB
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
        res = self.landmarker.detect_for_video(mp_img, timestamp_ms=self._timestamp)
        self._timestamp += 33
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)     # RGB to BGR

        if not res.face_landmarks:
            return frame, name, (-1,-1,-1,-1)

        for lms in res.face_landmarks:
            coords = np.array(
                [(lms[i].x * w, lms[i].y * h) for i in self.KP.values()],
                dtype=np.float32
            )

            aligned = norm_crop(frame, coords, image_size=self.image_size)
            if aligned is None:
                continue

            emb = self.embedder.get_embedding(aligned)
            name, score = self.find_most_similar(emb)

            # # 매칭 성공(= name이 None 아님) 했을 때
            # if name:
            #     # 1️⃣ 이미 캐시에 있던 항목이면 제거 (순서 갱신용)
            #     self.recent_cache.pop(name, None)

            #     # 2️⃣ (이름 → (임베딩, 마지막_프레임)) 을 맨 뒤에 삽입
            #     #    → OrderedDict에서 '맨 뒤' = '가장 최근 사용'
            #     self.recent_cache[name] = (emb, self.frame_idx)

            #     # 3️⃣ 용량 초과 시 가장 오래된 항목(LRU) 제거
            #     while len(self.recent_cache) > self.cache_size:
            #         self.recent_cache.popitem(last=False)   # last=False → 앞쪽(가장 오래된) pop

            #     self.frame_idx += 1

            xs, ys = coords[:, 0], coords[:, 1]
            x1, y1 = int(xs.min()), int(ys.min())
            x2, y2 = int(xs.max()), int(ys.max())

            label = f"{name} ({score:.2f})" if name else "Unknown"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame, label, (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2
            )
            
            return frame, name, (x1, y1, x2, y2)

if __name__ == "__main__":
    recognizer = FaceRecognizer(MODEL_DIR, DB_PATH)
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        out_frame = recognizer.recognize_frame(frame)
        cv2.imshow("Face Recognition", out_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
