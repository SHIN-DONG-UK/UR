# hailo_face_embedder.py
import numpy as np
import cv2
import hailo_platform as hpf


class HailoFaceEmbedder:
    """arcface_mobilefacenet.hef → 512-D 임베딩 (BGR 입력 전용)"""

    def __init__(self, hef_path: str, timeout_ms: int = 10_000):
        self.timeout_ms = timeout_ms

        # ── 1) VDevice + InferModel ───────────────────────────────────
        self.vdev   = hpf.VDevice()
        self.model  = self.vdev.create_infer_model(hef_path)
        self.model.input().set_format_type (hpf.FormatType.UINT8)
        self.model.output().set_format_type(hpf.FormatType.UINT8)

        # ── 2) Configure & 고정 바인딩/버퍼 1-세트 ───────────────────
        self.cfg = self.model.configure().__enter__()

        self.in_buf  = np.empty(self.model.input ().shape,  dtype=np.uint8)  # (1,112,112,3)
        self.out_buf = np.empty(self.model.output().shape, dtype=np.uint8)  # (1,512)

        self.bindings = self.cfg.create_bindings()
        self.bindings.input ().set_buffer(self.in_buf)
        self.bindings.output().set_buffer(self.out_buf)

    # ────────────────────────────────────────────────────────────────
    def get_embedding(self, bgr: np.ndarray) -> np.ndarray:
        """
        동기 추론 전용.
        Parameters
        ----------
        bgr : np.ndarray (112,112,3) uint8
        Returns
        -------
        np.ndarray (512,) float32, L2-normalized
        """
        if bgr.shape != (112, 112, 3) or bgr.dtype != np.uint8:
            raise ValueError("BGR uint8, shape (112,112,3) 필요")

        # 입력 복사만 하면 준비 끝
        self.in_buf[0] = bgr                        # copy 112×112×3
        self.cfg.run([self.bindings], self.timeout_ms)
        return self._postprocess()

    # ────────────────────────────────────────────────────────────────
    def close(self):
        self.cfg.__exit__(None, None, None)
        self.vdev.__exit__(None, None, None)

    # ────────────────────────────────────────────────────────────────
    def _postprocess(self) -> np.ndarray:
        raw = self.out_buf.squeeze()                  # uint8 (512,)
        fp  = (raw.astype(np.float32) - 127.5) * 128  # de-quant
        return fp / (np.linalg.norm(fp) + 1e-6)       # L2 정규화


# ─────────────────────────── 사용 예시 ───────────────────────────
if __name__ == "__main__":
    hef_path = "/home/god/S12P31C203/model/arcface_mobilefacenet.hef"
    embedder = HailoFaceEmbedder(hef_path)

    img_bgr = cv2.imread("/home/god/Pictures/myface.png")
    img_bgr = cv2.resize(img_bgr, (112, 112))

    vec = embedder.get_embedding(img_bgr)             # 반복 호출 OK
    print("norm:", np.linalg.norm(vec))

    embedder.close()
