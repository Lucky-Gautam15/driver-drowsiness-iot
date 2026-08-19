class EyeDetector:

    # MediaPipe Face Mesh landmark indexes

    LEFT_EYE = [
        33,
        160,
        158,
        133,
        153,
        144
    ]

    RIGHT_EYE = [
        362,
        385,
        387,
        263,
        373,
        380
    ]

    def get_eye_points(self, face_landmarks, frame_width, frame_height):

        left_eye = []
        right_eye = []

        for index in self.LEFT_EYE:

            landmark = face_landmarks.landmark[index]

            x = int(landmark.x * frame_width)
            y = int(landmark.y * frame_height)

            left_eye.append((x, y))

        for index in self.RIGHT_EYE:

            landmark = face_landmarks.landmark[index]

            x = int(landmark.x * frame_width)
            y = int(landmark.y * frame_height)

            right_eye.append((x, y))

        return left_eye, right_eye