import numpy as np
import cv2
import hailo_platform as hpf


class HailoFaceEmbedder:
    def __init__(self, hef_path: str):
        """
        hef_path: .hef 파일 경로 (문자열)
        interface: Hailo 플랫폼 인터페이스 (기본값 PCIe)
        """
        self.hef = hpf.HEF(hef_path)
        # VDevice 열기 (여기서부터 닫힐 때까지 열려 있음)
        self.dev = hpf.VDevice()
        params = hpf.ConfigureParams.create_from_hef(self.hef, interface=hpf.HailoStreamInterface.PCIe)
        self.ng = self.dev.configure(self.hef, params)[0]
        # 입출력 스트림 파라미터 생성 (재사용)
        self.in_params = hpf.InputVStreamParams.make_from_network_group(self.ng, quantized=True)
        self.out_params = hpf.OutputVStreamParams.make_from_network_group(self.ng, quantized=True)

    def get_embedding(self, aligned_rgb: np.ndarray) -> np.ndarray:
        """
        input  : NHWC(1, 112, 112, 3) 형태의 RGB 이미지 (0-255)
        return : UINT8 NC(512)
        """
        img = cv2.cvtColor(aligned_rgb, cv2.COLOR_RGB2BGR)
        inp = np.expand_dims(img, 0)        # (1, 112, 112, 3)  ← 배치 차원

        # aligned_bgr = cv2.cvtCoor(cv2.)
        with self.ng.activate(self.ng.create_params()):
            with hpf.InferVStreams(self.ng, self.in_params, self.out_params) as pipe:
                inputs = {self.hef.get_input_vstream_infos()[0].name: inp}
                outputs = pipe.infer(inputs)

        raw = outputs[self.hef.get_output_vstream_infos()[0].name].squeeze() #uint8

        fp = (raw.astype(np.float32) - 127.5) * 128              # ★ de-quant
        fp /= np.linalg.norm(fp) + 1e-6                          # ★ L2-norm (unit)
        return fp                                                # float32, ||·||=1

# 사용 예시
def main():
    hef_file = "/home/god/S12P31C203/model/arcface_mobilefacenet.hef"
    embedder = HailoFaceEmbedder(hef_file)

    aligned = cv2.imread("/home/god/Pictures/myface.png")
    aligned = cv2.resize(aligned, (112, 112))
    # 2) BGR → RGB 변환 방법 A: cvtColor 사용
    aligned = cv2.cvtColor(aligned, cv2.COLOR_BGR2RGB)
    aligned = np.expand_dims(aligned, axis=0)            # NHWC
    embedding = embedder.get_embedding(aligned)

    print("Embedding shape:", embedding.shape)
    print("Embedding vector:", embedding)


if __name__ == "__main__":
    main()
