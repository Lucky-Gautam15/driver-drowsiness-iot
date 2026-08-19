import cv2
import numpy as np


class HeadPoseDetector:

    def __init__(self):

        self.face_3d_points = np.array([
            (0.0, 0.0, 0.0),          # Nose
            (0.0, -330.0, -65.0),     # Chin
            (-225.0, 170.0, -135.0),  # Left eye
            (225.0, 170.0, -135.0),   # Right eye
            (-150.0, -150.0, -125.0), # Left mouth
            (150.0, -150.0, -125.0)   # Right mouth
        ], dtype=np.float64)

    def estimate(self, face_landmarks, frame_width, frame_height):

        image_points = []

        landmark_indexes = [
            1,      # Nose
            152,    # Chin
            33,     # Left eye
            263,    # Right eye
            61,     # Left mouth
            291     # Right mouth
        ]

        for index in landmark_indexes:

            landmark = face_landmarks.landmark[index]

            x = landmark.x * frame_width
            y = landmark.y * frame_height

            image_points.append((x, y))

        image_points = np.array(
            image_points,
            dtype=np.float64
        )

        focal_length = frame_width

        center = (
            frame_width / 2,
            frame_height / 2
        )

        camera_matrix = np.array([
            [focal_length, 0, center[0]],
            [0, focal_length, center[1]],
            [0, 0, 1]
        ], dtype=np.float64)

        dist_coeffs = np.zeros(
            (4, 1),
            dtype=np.float64
        )

        success, rotation_vector, translation_vector = cv2.solvePnP(
            self.face_3d_points,
            image_points,
            camera_matrix,
            dist_coeffs,
            flags=cv2.SOLVEPNP_ITERATIVE
        )

        if not success:

            return {
                "pitch": 0.0,
                "yaw": 0.0,
                "status": "UNKNOWN"
            }

        rotation_matrix, _ = cv2.Rodrigues(
            rotation_vector
        )

        angles, _, _, _, _, _ = cv2.RQDecomp3x3(
            rotation_matrix
        )

        pitch = float(angles[0])
        yaw = float(angles[1])

        if pitch > 15:

            status = "HEAD_DOWN"

        elif pitch < -15:

            status = "HEAD_UP"

        else:

            status = "NORMAL"

        return {
            "pitch": round(pitch, 2),
            "yaw": round(yaw, 2),
            "status": status
        }