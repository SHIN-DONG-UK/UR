from ultralytics import YOLO

# 1) fine-tuned 모델 로드
model = YOLO("best_v30.pt")

# 2) IMX export
model.export(
  format="imx",           # 포맷 지정
  data="/home/godputer/S12P31C203/AI-Camera/data5/data.yaml",     # PTQ용 캘리브레이션 데이터
  imgsz=640,              # 입력 사이즈
  int8=True,
  device=0,
)