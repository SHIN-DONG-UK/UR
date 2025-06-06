from __future__ import annotations
from pathlib import Path

import cv2
import numpy as np
from utils.face_db import FaceDB
from utils.hailo_face_embedder import HailoFaceEmbedder
from utils.face_extractor import FaceExtractor

MODEL_DIR = "./model"
MODEL_NAME = "arcface_mobilefacenet.hef"

def cli_register(db: FaceDB):
    embedder = HailoFaceEmbedder(MODEL_DIR + '/' + MODEL_NAME)
    extractor = FaceExtractor(MODEL_DIR)

    print("=== 얼굴 등록기 (MediaPipe + InsightFace Align) ===")
    while True:
        name = input("이름 (exit 입력 시 종료): ").strip()
        if name.lower() == "exit":
            break

        path_str = input("이미지 경로 또는 폴더 경로: ").strip()
        path = Path(path_str)
        if not path.exists():
            print("❌ 경로가 존재하지 않습니다.")
            continue

        # 1) 폴더일 때: 하위 모든 이미지 파일 순회
        if path.is_dir():
            imgs = list(path.rglob("*"))
            imgs = [p for p in imgs if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".bmp")]
            if not imgs:
                print("❌ 폴더에 이미지 파일이 없습니다.")
                continue

            for img_file in imgs:
                _, aligned = extractor.extract(str(img_file))
                if aligned is None:
                    continue
                emb = embedder.get_embedding(aligned)
                db.add_face(name, str(img_file), emb)
                print(f"✅ {name} – {img_file.name} 등록 완료")
            print(f"🎉 폴더 등록 완료!\n")

        # 2) 단일 파일일 때
        else:
            _, aligned = extractor.extract(str(path))
            if aligned is None:
                continue
            emb = embedder.get_embedding(aligned)
            print(*emb, sep=',')
            db.add_face(name, str(path), emb)
            print(f"✅ {name} 등록 완료")

# ────────────────────────────────
# Entry point
# ────────────────────────────────
if __name__ == "__main__":
    db = FaceDB("./face_db.sqlite")
    try:
        cli_register(db)
    finally:
        db.close()
        print("👋 프로그램 종료")
