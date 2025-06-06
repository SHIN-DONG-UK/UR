import cv2
import numpy as np

class PolygonROISelector:
    def __init__(self, window_name="Polygon ROI"):
        self.window_name = window_name
        self.poly_pts = []
        self.drawing = True
        self.frame_display = None

    def _on_mouse(self, event, x, y, flags, param):
        if not self.drawing:
            return
        if event == cv2.EVENT_LBUTTONDOWN:
            self.poly_pts.append((x, y))
            cv2.circle(self.frame_display, (x, y), 3, (0, 0, 255), -1)

    def select(self, frame):
        """
        frame: BGR 이미지 (numpy.ndarray)
        클릭으로 다각형 꼭짓점을 추가하고,
        'r' 키로 초기화, 'c' 키로 완료합니다.
        반환값: [(x1,y1), (x2,y2), ...]
        """
        # 초기화
        self.poly_pts = []
        self.drawing = True
        self.frame_display = frame.copy()

        # 윈도우 및 콜백 설정
        cv2.namedWindow(self.window_name)
        cv2.setMouseCallback(self.window_name, self._on_mouse)

        while True:
            disp = self.frame_display.copy()
            if len(self.poly_pts) > 1:
                cv2.polylines(disp,
                              [np.array(self.poly_pts, dtype=np.int32)],
                              False,        # 열린 다각형
                              (0, 255, 0),  # 선 색
                              1)            # 두께

            cv2.imshow(self.window_name, disp)
            key = cv2.waitKey(1) & 0xFF

            if key == ord('c'):      # 완료
                self.drawing = False
                break
            elif key == ord('r'):    # 초기화
                self.poly_pts = []
                self.frame_display = frame.copy()

        cv2.destroyWindow(self.window_name)
        return self.poly_pts
