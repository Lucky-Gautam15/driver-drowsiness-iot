import os
import platform
import cv2


class Camera:

    def __init__(self, camera_index=None):
        if camera_index is None:
            env_source = os.getenv("CAMERA_SOURCE", "0")
            if env_source.isdigit():
                self.camera_index = int(env_source)
            else:
                self.camera_index = env_source
        else:
            self.camera_index = camera_index
        self.cap = None

    def start(self):
        if self.cap is not None:
            return

        if isinstance(self.camera_index, int) and platform.system() == "Windows":
            self.cap = cv2.VideoCapture(
                self.camera_index,
                cv2.CAP_DSHOW
            )
        else:
            self.cap = cv2.VideoCapture(self.camera_index)

        if not self.cap.isOpened():
            self.cap.release()
            self.cap = None

            raise RuntimeError(
                f"Could not open camera source: {self.camera_index}."
            )

        # Set reasonable resolution if numeric webcam index
        if isinstance(self.camera_index, int):
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