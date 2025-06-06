# 로컬 PC 환경
from ultralytics import YOLO
model = YOLO('./models/best_v2.pt')

model.predict(source=0, imgsz=640, conf=0.25, show=True)  # 0=웹캠