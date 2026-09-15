import cv2
import numpy as np


class HeadPoseDetector:

    def __init__(self):
        # 3D model points oriented in OpenCV coordinate system (+X right, +Y down, +Z into camera)
        self.face_3d_points = np.array([
            (0.0, 0.0, 0.0),            # Nose tip (landmark 1)
            (0.0, 330.0, -65.0),        # Chin (landmark 152)
            (-225.0, -170.0, -135.0),   # Left eye corner (landmark 33)
            (225.0, -170.0, -135.0),    # Right eye corner (landmark 263)
            (-150.0, 150.0, -125.0),    # Left mouth corner (landmark 61)
            (150.0, 150.0, -125.0),     # Right mouth corner (landmark 291)
            (0.0, -340.0, -120.0)       # Forehead top (landmark 10)
        ], dtype=np.float64)

        self.landmark_indexes = [1, 152, 33, 263, 61, 291, 10]

    def estimate(self, face_landmarks, frame_width, frame_height):
        image_points = []

        for index in self.landmark_indexes:
            landmark = face_landmarks.landmark[index]
            x = landmark.x * frame_width
            y = landmark.y * frame_height
            image_points.append((x, y))

        image_points = np.array(image_points, dtype=np.float64)

        # Approximate camera intrinsic matrix
        focal_length = frame_width
        center = (frame_width / 2.0, frame_height / 2.0)

        camera_matrix = np.array([
            [focal_length, 0, center[0]],
            [0, focal_length, center[1]],
            [0, 0, 1]
        ], dtype=np.float64)

        dist_coeffs = np.zeros((4, 1), dtype=np.float64)

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

        rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rotation_matrix)

        pitch = float(angles[0])
        yaw = float(angles[1])

        # -------------------------------------------------------------
        # 2D Geometric Anthropometric Landmark Ratio Check (Dual-Verify)
        # Prevents camera angle bias and solvePnP gimbal edge cases
        # -------------------------------------------------------------
        nose_y = face_landmarks.landmark[1].y * frame_height
        chin_y = face_landmarks.landmark[152].y * frame_height
        eye_y = (face_landmarks.landmark[33].y + face_landmarks.landmark[263].y) / 2.0 * frame_height

        upper_face_dist = max(0.1, nose_y - eye_y)
        lower_face_dist = max(0.1, chin_y - nose_y)
        vertical_ratio = upper_face_dist / lower_face_dist

        # -------------------------------------------------------------
        # Robust Head Up / Down Classification
        # -------------------------------------------------------------
        # When head tilts down: pitch increases and lower_face foreshortens (ratio > 1.05)
        # When head tilts up: pitch decreases and upper_face compresses (ratio < 0.48)
        if pitch > 10.0 or vertical_ratio > 1.05:
            status = "HEAD_DOWN"
        elif pitch < -10.0 or vertical_ratio < 0.48:
            status = "HEAD_UP"
        else:
            status = "NORMAL"

        return {
            "pitch": round(pitch, 1),
            "yaw": round(yaw, 1),
            "status": status,
            "vertical_ratio": round(vertical_ratio, 2)
        }