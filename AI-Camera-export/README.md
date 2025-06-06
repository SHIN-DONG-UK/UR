## AI-Camera
### 그냥 CPU로 돌리면 yolo는 몇 프레임이 나올까?
- 놀랍게도 1프레임이 나온다
- *yolov8s 기준
- 그럼 어떻게 해야 할까?
- AI 카메라를 활용한다

### AI-Camera 세팅
- 아래 링크를 따라간다
https://www.raspberrypi.com/documentation/accessories/ai-camera.html


<br>

# yolo 모델을 fine-tuning해서 imx로 export하는 방법
## 📄 목차

1. 개요
2. 환경 설정
3. 데이터 준비
4. YOLO 모델 파인튜닝
5. IMX500용 모델 Export
6. 고급: 커스텀 레이어 등록
7. 부록: 오프라인 환경에서 휠 설치

## 1. 개요

이 문서에서는 Ultralytics YOLO 모델을:

1. 본인 데이터셋에 맞춰 파인튜닝
2. PTQ(Post-Training Quantization) 방식으로 int8 양자화
3. Sony IMX500 포맷으로 변환

까지의 과정을 한 번에 실행하는 방법을 다룹니다.

## 2. 환경 설정

### 2.1. Python 가상환경 생성

```bash
python3 -m venv yolopi
source yolopi/bin/activate
```

### 2.2. 필수 패키지 설치

```bash
pip install ultralytics   # YOLO 라이브러리
pip install \
  "model-compression-toolkit>=2.3.0" \
  "sony-custom-layers>=0.3.0" \
  "edge-mdt-tpc>=1.1.0" \
  "imx500-converter[pt]>=3.16.1"
```

> ⚠️ IMX export에 필요한 네 가지 패키지를 반드시 미리 설치해야 합니다.
> 

## 3. 데이터 준비

1. **데이터셋 구조**
    
    ```
    /mydata/
      images/
        train/
        val/
      labels/
        train/
        val/
    ```
    
2. **`mydata.yaml`**
    
    ```yaml
    train: ./mydata/images/train
    val:   ./mydata/images/val
    
    nc: 3            # 클래스 수
    names: [“사람”, “차량”, “자전거”]
    ```
    

## 4. YOLO 모델 파인튜닝

Ultralytics API를 사용해 기본(pre-trained) YOLOn 모델을 본인 데이터에 맞춰 fine-tune 합니다.

```python
from ultralytics import YOLO

# 1) 모델 로드 (예: nano 버전)
model = YOLO("yolo11n.pt")

# 2) 파인튜닝
model.train(
  data="mydata.yaml",  # 데이터셋 설정 파일
  epochs=50,           # 에폭 수
  imgsz=640,           # 입력 해상도
  batch=16,            # 배치 크기
)
```

- `yolo11n.pt` 대신 `yolo_custom.pt` 등 본인이 원하는 초기 체크포인트를 지정할 수 있습니다.
- 학습이 끝나면 `runs/train/exp/weights/best.pt` 형태로 최종 파인튜닝 모델이 저장됩니다.

## 5. IMX500용 모델 Export

파인튜닝한 `.pt` 모델을 Sony IMX500 포맷으로 한 번에 내보냅니다.

```python
from ultralytics import YOLO

# 1) fine-tuned 모델 로드
model = YOLO("runs/train/exp/weights/best.pt")

# 2) IMX export
model.export(
  format="imx",           # 포맷 지정
  data="mydata.yaml",     # PTQ용 캘리브레이션 데이터
  imgsz=640,              # 입력 사이즈
)
```

실행 후, 현재 디렉터리에 다음 파일들이 생성됩니다:

- `model.onnx` : PTQ 양자화된 ONNX 그래프
- `model_imx/` : IMX500 바이너리 및 패커 출력

## 6. 고급: 커스텀 레이어 등록

만약 모델에 **표준 YOLO** 이외에 **사용자 정의(Custom) Layer**가 포함되어 있다면:

1. `sony-custom-layers` API를 통해 Python으로 레이어 구현
2. 파인튜닝·Export 스크립트 상단에 반드시 `import your_custom_layers`

```python
# my_layers.py
import torch
from sony_custom_layers import register_torch_op

@register_torch_op("MyOp")
class MyOp(torch.nn.Module):
    def forward(self, x):
        # 구현 내용
        return x
```

```python
# export.py
import my_layers         # 커스텀 레이어 등록
from ultralytics import YOLO

model = YOLO("best.pt")
model.export(format="imx", data="calib.yaml")
```

## 7. 부록: 오프라인 환경에서 휠 설치

Pi나 오프라인 머신에 직접 설치가 불가능할 때:

1. 인터넷 연결된 PC에서 패키지 다운로드
    
    ```bash
    pip download \
      model-compression-toolkit>=2.3.0 \
      sony-custom-layers>=0.3.0 \
      edge-mdt-tpc>=1.1.0 \
      "imx500-converter[pt]>=3.16.1"
    ```
    
2. 생성된 `.whl` 파일을 USB 등으로 전달
3. 오프라인 머신에서
    
    ```bash
    pip install *.whl
    ```

## 주의: IMX export only supported for YOLOv8n and YOLO11n models.