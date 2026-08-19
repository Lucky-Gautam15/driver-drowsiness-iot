class MouthDetector:

    MOUTH = [
        61,
        81,
        311,
        291,
        308,
        178
    ]

    def get_mouth_points(
        self,
        face_landmarks,
        frame_width,
        frame_height
    ):

        mouth = []

        for index in self.MOUTH:

            landmark = face_landmarks.landmark[index]

            x = int(landmark.x * frame_width)
            y = int(landmark.y * frame_height)

            mouth.append((x, y))

        return mouth