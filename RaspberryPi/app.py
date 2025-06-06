import argparse
import sys
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
import time

from picamera2 import Picamera2
from picamera2.devices import IMX500
from picamera2.devices.imx500 import (
    NetworkIntrinsics,
    postprocess_nanodet_detection
)

from utils.face_recognizer import FaceRecognizer
from utils.sorted_kv import SortedKV
from utils.polygon_roi_selector import PolygonROISelector

from collections import Counter

import json
from paho.mqtt import client as mqtt
from paho.mqtt.client import CallbackAPIVersion

last_detections = []
last_results = None


class Detection:
    def __init__(self, coords, category, conf, metadata):
        self.category = category
        self.conf = conf
        self.box = imx500.convert_inference_coords(coords, metadata, picam2)

def parse_detections(metadata: dict):
    global last_detections
    threshold = args.threshold
    iou       = args.iou
    max_det   = args.max_detections

    np_out = imx500.get_outputs(metadata, add_batch=True)
    if np_out is None:
        return last_detections

    iw, ih = imx500.get_input_size()
    if intrinsics.postprocess == "nanodet":
        boxes, scores, classes = postprocess_nanodet_detection(
            outputs=np_out[0], conf=threshold,
            iou_thres=iou, max_out_dets=max_det
        )[0]
        from picamera2.devices.imx500.postprocess import scale_boxes
        boxes = scale_boxes(boxes, 1, 1, ih, iw, False, False)
    else:
        boxes, scores, classes = np_out[0][0], np_out[1][0], np_out[2][0]
        if intrinsics.bbox_normalization:
            boxes = boxes / ih
        if intrinsics.bbox_order == "xy":
            boxes = boxes[:, [1, 0, 3, 2]]
        boxes = np.array_split(boxes, 4, axis=1)
        boxes = zip(*boxes)

    last_detections = [
        Detection(b, c, s, metadata)
        for b, s, c in zip(boxes, scores, classes)
        if s > threshold
    ]
    return last_detections


@lru_cache
def get_labels():
    labels = intrinsics.labels
    if intrinsics.ignore_dash_labels:
        labels = [l for l in labels if l and l != "-"]
    return labels

if __name__ == "__main__":
    ################# 최소한의 argparse ###############
    parser = argparse.ArgumentParser()
    parser.add_argument("--threshold", type=float, default=0.55)
    parser.add_argument("--iou", type=float, default=0.65)
    parser.add_argument("--max-detections", type=int, default=10)
    args = parser.parse_args()
    ##################################################


    ###################### Counter ##################
    k_face = 5
    k_object = 10
    store_face = Counter()
    store_objects = Counter()
    ##################################################


    ###################### MQTT ######################
    BROKER = "192.168.100.214"
    PORT   = 1883
    TOPIC  = "pub_msg"
    client = mqtt.Client(client_id="raspberrypi_A", protocol=mqtt.MQTTv311)   # ← 이 옵션만 추가!
    client.connect(BROKER, PORT, keepalive=60)
    client.loop_start()
    ##################################################


    ################# Hailo&IMX ######################
    MODEL_DIR = "./model/"
    DB_PATH = Path("face_db.sqlite")
    LABEL_PATH = Path("./model/labels.txt")
    imx500 = IMX500(MODEL_DIR + "last.rpk") # 경로
    
    intrinsics = imx500.network_intrinsics or NetworkIntrinsics()
    intrinsics.task = "object detection"
    intrinsics.bbox_normalization = True
    intrinsics.bbox_order = "xy"
    intrinsics.labels = [line.strip() for line in LABEL_PATH.read_text().splitlines()]
    intrinsics.update_with_defaults()
    picam2 = Picamera2(imx500.camera_num)
    cfg = picam2.create_preview_configuration(controls={"FrameRate": intrinsics.inference_rate},buffer_count=12)
    imx500.show_network_fw_progress_bar()
    picam2.start(cfg, show_preview=False)
    # cv2.namedWindow("Integrated Demo", cv2.WINDOW_NORMAL)
    # Face Part
    recognizer = FaceRecognizer(MODEL_DIR, DB_PATH)
    ##################################################


    ###################### Selector ##################
    # 첫 프레임 캡처하여 ROI 선택
    req = picam2.capture_request()
    rgb = req.make_array("main")
    frame0 = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    req.release()
    selector = PolygonROISelector()
    poly_pts = selector.select(frame0)
    ##################################################

    prev_time = time.time()
    while True:
        ################# preprocessing######################
        inside_any = False
        last_request = picam2.capture_request()
        frame        = last_request.make_array("main")
        frame        = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        metadata     = last_request.get_metadata()
        detections   = parse_detections(metadata)
        # print("[DEBUG] detections count:", len(detections))
        #####################################################


        ################# pipeline ##########################
        payload = {"name": '', "objects": '', "time": ''}

        # 1) 사용자 얼굴 인식 파이프라인 결과
        frame, name, fbox = recognizer.recognize_frame(frame)
        if name != "Unknown" and name != '' and name:
            cx, cy = (fbox[0] + fbox[2]) // 2, (fbox[1] + fbox[3]) // 2
            pts = np.array(poly_pts, dtype=np.int32)  # shape=(N,2)
            if cv2.pointPolygonTest(pts, (cx, cy), False) >= 0:
                inside_any = True
                store_face[name] += 1

                if store_face[name] >= k_face:
                    payload["name"] = name
                    store_face.clear() # reset

        # 2) IMX 디텍션
        labels = get_labels()
        print(len(detections))
        if len(detections) > 0:
            print(labels[int(detections[0].category)])
        for det in detections:
            x, y, w, h = det.box
            cx, cy = x + w//2, y + h//2
            pts = np.array(poly_pts, dtype=np.int32)  # shape=(N,2)
            if cv2.pointPolygonTest(pts, (cx, cy), False) >= 0:
                inside_any = True
                obj = labels[int(det.category)]
                store_objects[obj] += 1

                if store_objects[obj] >= k_object:
                    payload["objects"] += (obj + ',')
                    store_objects[obj] = 0
        
        # 3) MQTT publish
        payload["time"] = time.time()
        if payload["name"] == '' and payload["objects"] == '':
            pass
        else:

            client.publish(TOPIC, json.dumps(payload))
        #####################################################


        ###################### draw #########################
        # 현재 시간과 이전 프레임 시간 차이로 FPS 계산
        curr_time = time.time()
        fps = 1.0 / (curr_time - prev_time)
        prev_time = curr_time
        # 하단에 FPS 표시
        fps_text = f"FPS: {fps:.2f}"
        cv2.putText(frame, fps_text,
            (10, frame.shape[0] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,               # 폰트 크기
            (255, 255, 255),   # 흰색
            2                  # 두께
        )
        # 다각형 표시
        cv2.polylines(frame,
                    [np.array(poly_pts, dtype=np.int32)],
                    True, (255, 0, 0), 2)
        # 다각형 내부 채우기
        if inside_any:
            overlay = frame.copy()
            # 초록 계열 반투명
            cv2.fillPoly(overlay, [pts], (0, 200, 0))
            # 원본(frame)과 합성: overlay가 30% 보이게
            frame = cv2.addWeighted(overlay, 0.3, frame, 0.7, 0)

        for det in detections:
            x, y, w, h = det.box
            print(det.box)
            text = f"{labels[int(det.category)]} ({det.conf:.2f})"
            (tw, th), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            tx, ty = x + 5, y + 15

            # draw text
            cv2.putText(frame, text, (tx, ty), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
            # draw bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0,255,0), 2)
        
        cv2.imshow("Integrated Demo", frame)
        #######################################################

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        last_request.release()

    picam2.stop()
    cv2.destroyAllWindows()
    client.loop_stop()
    client.disconnect()
