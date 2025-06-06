from pathlib import Path
import cv2
import numpy as np
import mediapipe as mp
from utils.face_align import norm_crop

class FaceExtractor:
    """
    MediaPipe FaceLandmarker를 사용하여
    - 이미지 모드로 단일 이미지에서 얼굴 감지 및 정렬
    - 비디오 모드로 연속 프레임에서 얼굴 감지 및 정렬
    """
    KP = {
        "LE": 468,  # left eye pupil centre
        "RE": 473,  # right eye pupil centre
        "Nose": 1,  # nose tip
        "LM": 61,   # left mouth corner
        "RM": 291   # right mouth corner
    }

    def __init__(self, model_dir: str | Path, image_size: int = 112):
        """
        model_dir: face_landmarker.task 파일이 위치한 디렉토리
        image_size: 정렬된 얼굴 이미지 크기 (정사각형)
        """
        self.model_dir = Path(model_dir)
        self.landmark_model = self.model_dir / "face_landmarker.task"
        self.image_size = image_size
        self._timestamp = 0

        # 이미지 모드 랜드마커
        img_options = mp.tasks.vision.FaceLandmarkerOptions(
            base_options=mp.tasks.BaseOptions(model_asset_path=str(self.landmark_model)),
            running_mode=mp.tasks.vision.RunningMode.IMAGE,
        )
        self.image_landmarker = mp.tasks.vision.FaceLandmarker.create_from_options(img_options)

    def extract(self, img_path: str) -> tuple[np.ndarray | None, np.ndarray | None]:
        """
        IMAGE 모드로 단일 이미지 파일에서 얼굴 감지 및 정렬합니다.
        Returns:
            (원본 BGR 이미지, 정렬된 BGR 얼굴) 또는 실패 시 (None, None)
        """
        img = cv2.imread(img_path)
        if img is None:
            print(f"❌ 이미지 로드 실패: {img_path}")
            return None, None
        # 이미지 모드 detect
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # BGR -> RGB

        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=img)
        res = self.image_landmarker.detect(mp_img)
        return self._process_result(img, res)

    def _process_result(self, img: np.ndarray, res) -> tuple[np.ndarray | None, np.ndarray | None]:
        # 얼굴 랜드마크 처리 공통
        if not res.face_landmarks:
            print("❌ 얼굴 감지 실패")
            return None, None
        if len(res.face_landmarks) > 1:
            print("❌ 얼굴이 2개 이상 감지됨. 단일 얼굴 이미지를 사용하세요.")
            return None, None

        # 5개 랜드마크 좌표 계산 (픽셀 단위)
        lms = res.face_landmarks[0]
        h, w = img.shape[:2]
        coords = {k: (lms[i].x * w, lms[i].y * h) for k, i in self.KP.items()}
        src = np.array([coords[k] for k in ["LE", "RE", "Nose", "LM", "RM"]], dtype=np.float32)

        # warp & crop
        aligned = norm_crop(img, src, image_size=self.image_size)
        if aligned is None:
            print("❌ 정렬 실패")
            return None, None

        aligned = cv2.cvtColor(aligned, cv2.COLOR_RGB2BGR) # RGB -> BGR
        return img, aligned


if __name__ == "__main__":
    extractor = FaceExtractor("./model")
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        orig, aligned = extractor.extract_from_numpy(frame)
        if aligned is not None:
            cv2.imshow("Aligned Face", aligned)
        cv2.imshow("Frame", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
