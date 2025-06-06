# visualize_clean.py
import os, glob, random, cv2, math
from pathlib import Path
import matplotlib.pyplot as plt

ROOT   = r"C:\coco_plusdata"
IMGDIR = os.path.join(ROOT, "images")
LBLDIR = os.path.join(ROOT, "labels")
N      = 80           # 샘플 수
COLS   = 8            # 한 줄에 몇 장

cands = random.sample(
    glob.glob(os.path.join(IMGDIR, "*.*g")),
    k=min(N, len(os.listdir(IMGDIR)))
)

def draw_bbox(img_p, lbl_p):
    img = cv2.imread(img_p)
    if img is None: return None
    h, w = img.shape[:2]
    if os.path.exists(lbl_p):
        for line in open(lbl_p):
            cls, xc, yc, bw, bh = map(float, line.split())
            # class별 색상
            if cls == 2:   color = (0,   0,255)   # closed (red)
            elif cls == 1: color = (0, 255,  0)   # opened (green)
            else:          color = (255, 0,  0)   # 기타 (blue)
            x1, y1 = int((xc-bw/2)*w), int((yc-bh/2)*h)
            x2, y2 = int((xc+bw/2)*w), int((yc+bh/2)*h)
            cv2.rectangle(img, (x1,y1), (x2,y2), color, 2)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

rows = math.ceil(len(cands)/COLS)
plt.figure(figsize=(COLS*4, rows*3.5))

for i, img_p in enumerate(cands, 1):
    lbl_p = os.path.join(LBLDIR, f"{Path(img_p).stem}.txt")
    vis = draw_bbox(img_p, lbl_p)
    if vis is None: continue
    plt.subplot(rows, COLS, i)
    plt.imshow(vis); plt.axis("off")   # ← 제목 없앰

plt.subplots_adjust(wspace=0.02, hspace=0.02)  # 여백 최소화
plt.show()
