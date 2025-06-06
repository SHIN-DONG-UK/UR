# visualize_augmented.py
import os, glob, random, cv2, math
from pathlib import Path
import matplotlib.pyplot as plt

ROOT   = r"C:\coco_plusdata"        # images / labels
IMGDIR = os.path.join(ROOT, "images")
LBLDIR = os.path.join(ROOT, "labels")
N_SAMPLES = 20                            # 보고 싶은 이미지 수
COLS      = 5                             # 그리드 열 수

# ───────── 1) 무작위 샘플 N개 선택 ─────────────────────────────────────
candidates = random.sample(
    glob.glob(os.path.join(IMGDIR, "*.*g")),   # jpg, png …
    k=min(N_SAMPLES, len(os.listdir(IMGDIR)))
)

# ───────── 2) 보조 함수: 라벨 → 박스 그리기 ───────────────────────────
def draw_yolo_bbox(img_path, lbl_path):
    img  = cv2.imread(img_path)
    if img is None:
        return None
    h, w = img.shape[:2]

    # txt 읽기
    if os.path.exists(lbl_path):
        for line in open(lbl_path):
            cls, xc, yc, bw, bh = map(float, line.split())
            # ✔️ class 색상 구분 (0=빨강=closed, 1=초록=opened)
            color = (0, 0, 255) if cls == 0 else (0, 255, 0)
            # YOLO → 픽셀 사각형
            x1 = int((xc - bw / 2) * w)
            y1 = int((yc - bh / 2) * h)
            x2 = int((xc + bw / 2) * w)
            y2 = int((yc + bh / 2) * h)
            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# ───────── 3) Matplotlib 그리드로 시각화 ───────────────────────────────
rows = math.ceil(len(candidates) / COLS)
plt.figure(figsize=(COLS * 4, rows * 3.5))

for i, img_path in enumerate(candidates, 1):
    stem = Path(img_path).stem
    lbl_path = os.path.join(LBLDIR, f"{stem}.txt")
    vis = draw_yolo_bbox(img_path, lbl_path)
    if vis is None:
        continue
    plt.subplot(rows, COLS, i)
    plt.imshow(vis)
    plt.axis("off")
    plt.title(stem, fontsize=8)

plt.tight_layout()
plt.show()
