import threading
import time

import cv2

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.detection.face_detector import FaceDetector
from app.detection.eye_detector import EyeDetector
from app.detection.mouth_detector import MouthDetector
from app.detection.head_pose import HeadPoseDetector

from app.algorithms.ear import calculate_ear
from app.algorithms.mar import calculate_mar
from app.algorithms.drowsiness import DrowsinessDetector

from app.camera.camera import Camera
from app.config import settings
from app.services.alert_service import alert_service


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="Driver Drowsiness Detection API",
    description="IoT based driver monitoring system",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# GLOBAL DETECTION STATE
# =========================================================

detection_data = {
    "status": "OFFLINE",
    "score": 0,
    "ear": 0.0,
    "mar": 0.0,
    "head_pose": "UNKNOWN",
    "eyes_closed": False,
    "yawning": False,
    "head_down": False,
    "camera": False
}


# =========================================================
# GLOBAL OBJECTS
# =========================================================

camera = None

face_detector = None
eye_detector = None
mouth_detector = None
head_pose_detector = None
drowsiness_detector = None

detection_thread = None

running = False

latest_frame = None

frame_lock = threading.Lock()


# =========================================================
# RESET STATE
# =========================================================

def reset_detection_state():

    global detection_data

    detection_data.update({
        "status": "OFFLINE",
        "score": 0,
        "ear": 0.0,
        "mar": 0.0,
        "head_pose": "UNKNOWN",
        "eyes_closed": False,
        "yawning": False,
        "head_down": False,
        "camera": False
    })


# =========================================================
# INITIALIZE AI
# =========================================================

def initialize_detection():

    global camera
    global face_detector
    global eye_detector
    global mouth_detector
    global head_pose_detector
    global drowsiness_detector

    camera = Camera(camera_index=0)

    face_detector = FaceDetector()
    eye_detector = EyeDetector()
    mouth_detector = MouthDetector()
    head_pose_detector = HeadPoseDetector()

    drowsiness_detector = DrowsinessDetector(
        ear_threshold=settings.EAR_THRESHOLD,
        mar_threshold=settings.MAR_THRESHOLD,
        max_closed_frames=settings.MAX_CLOSED_FRAMES
    )


# =========================================================
# DETECTION LOOP
# =========================================================

def detection_loop():

    global running
    global latest_frame
    global camera

    try:

        camera.start()

        detection_data["camera"] = True

        print("Camera started successfully.")

        while running:

            frame = camera.read()

            if frame is None:

                detection_data["camera"] = False
                detection_data["status"] = "CAMERA ERROR"

                time.sleep(0.1)

                continue

            # ---------------------------------------------
            # Save latest frame
            # ---------------------------------------------

            with frame_lock:
                latest_frame = frame.copy()

            # ---------------------------------------------
            # Frame dimensions
            # ---------------------------------------------

            height, width = frame.shape[:2]

            # ---------------------------------------------
            # Face Detection
            # ---------------------------------------------

            face = face_detector.detect(frame)

            if face is None:

                detection_data.update({
                    "status": "NO FACE",
                    "score": 0,
                    "ear": 0.0,
                    "mar": 0.0,
                    "head_pose": "UNKNOWN",
                    "eyes_closed": False,
                    "yawning": False,
                    "head_down": False,
                    "camera": True
                })

                time.sleep(0.01)

                continue

            # ---------------------------------------------
            # Eye Detection
            # ---------------------------------------------

            left_eye, right_eye = eye_detector.get_eye_points(
                face,
                width,
                height
            )

            left_ear = calculate_ear(left_eye)
            right_ear = calculate_ear(right_eye)

            ear = (left_ear + right_ear) / 2.0

            # ---------------------------------------------
            # Mouth Detection
            # ---------------------------------------------

            mouth = mouth_detector.get_mouth_points(
                face,
                width,
                height
            )

            mar = calculate_mar(mouth)

            # ---------------------------------------------
            # Head Pose
            # ---------------------------------------------

            head_result = head_pose_detector.estimate(
                face,
                width,
                height
            )

            head_pose = head_result["status"]

            # ---------------------------------------------
            # Drowsiness
            # ---------------------------------------------

            result = drowsiness_detector.update(
                ear,
                mar,
                head_pose
            )

            # ---------------------------------------------
            # Update State
            # ---------------------------------------------

            detection_data.update({

                "status": result["status"],

                "score": result["score"],

                "ear": result["ear"],

                "mar": result["mar"],

                "head_pose": head_pose,

                "eyes_closed": result["eyes_closed"],

                "yawning": result["yawning"],

                "head_down": result["head_down"],

                "camera": True
            })

            # Notify backend asynchronously if critical or periodic
            alert_service.notify_detection(detection_data)

            time.sleep(0.01)

    except Exception as error:

        print("Detection error:", error)

        detection_data["status"] = "CAMERA ERROR"
        detection_data["camera"] = False

    finally:

        if camera is not None:
            camera.release()

        detection_data["camera"] = False

        if running:
            detection_data["status"] = "CAMERA ERROR"


# =========================================================
# START DETECTION
# =========================================================

@app.post("/api/detection/start")
def start_detection():

    global running
    global detection_thread

    if running:

        return {
            "message": "Detection already running",
            "running": True
        }

    try:

        initialize_detection()

        reset_detection_state()

        running = True

        detection_thread = threading.Thread(
            target=detection_loop,
            daemon=True
        )

        detection_thread.start()

        return {
            "message": "Drowsiness detection started",
            "running": True
        }

    except Exception as error:

        running = False

        return {
            "message": f"Could not start detection: {error}",
            "running": False
        }


# =========================================================
# STOP DETECTION
# =========================================================

@app.post("/api/detection/stop")
def stop_detection():

    global running
    global latest_frame

    running = False

    reset_detection_state()

    with frame_lock:
        latest_frame = None

    return {
        "message": "Drowsiness detection stopped",
        "running": False
    }


# =========================================================
# GET DETECTION STATUS
# =========================================================

@app.get("/api/detection/status")
def get_detection_status():

    return detection_data


# =========================================================
# CAMERA FRAME GENERATOR
# =========================================================

def generate_camera_frames():

    while True:

        with frame_lock:

            if latest_frame is None:
                frame = None
            else:
                frame = latest_frame.copy()

        if frame is None:

            time.sleep(0.05)

            continue

        # ---------------------------------------------
        # Encode OpenCV frame as JPEG
        # ---------------------------------------------

        success, encoded_image = cv2.imencode(
            ".jpg",
            frame
        )

        if not success:
            continue

        frame_bytes = encoded_image.tobytes()

        # ---------------------------------------------
        # MJPEG
        # ---------------------------------------------

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n"
            b"Cache-Control: no-cache\r\n\r\n"
            + frame_bytes
            + b"\r\n"
        )

        time.sleep(0.03)


# =========================================================
# CAMERA STREAM
# =========================================================

@app.get("/api/camera/stream")
def camera_stream():

    return StreamingResponse(
        generate_camera_frames(),
        media_type=(
            "multipart/x-mixed-replace; boundary=frame"
        )
    )


# =========================================================
# CAMERA STATUS
# =========================================================

@app.get("/api/camera/status")
def camera_status():

    return {
        "camera": detection_data["camera"],
        "running": running
    }


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "Driver Drowsiness Detection API",
        "status": "running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "ai-service"
    }