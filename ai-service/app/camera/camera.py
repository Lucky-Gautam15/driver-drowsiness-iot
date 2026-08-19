import cv2


class Camera:

    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.cap = None

    def start(self):
        if self.cap is not None:
            return

        self.cap = cv2.VideoCapture(
            self.camera_index,
            cv2.CAP_DSHOW
        )

        if not self.cap.isOpened():
            self.cap.release()
            self.cap = None

            raise RuntimeError(
                f"Could not open webcam at index {self.camera_index}."
            )

        # Set reasonable resolution
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    def read(self):
        if self.cap is None:
            raise RuntimeError(
                "Camera has not been started."
            )

        success, frame = self.cap.read()

        if not success:
            return None

        return frame

    def release(self):
        if self.cap is not None:
            self.cap.release()
            self.cap = None

        cv2.destroyAllWindows()