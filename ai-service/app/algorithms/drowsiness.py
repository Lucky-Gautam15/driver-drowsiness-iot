class DrowsinessDetector:

    def __init__(
        self,
        ear_threshold=0.22,
        mar_threshold=0.60,
        max_closed_frames=15
    ):

        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.max_closed_frames = max_closed_frames

        self.closed_frames = 0
        self.yawn_frames = 0

    def update(self, ear, mar, head_status):

        # -----------------------------
        # Eye closure detection
        # -----------------------------

        if ear < self.ear_threshold:

            self.closed_frames += 1

        else:

            self.closed_frames = 0

        eyes_closed = (
            self.closed_frames >= self.max_closed_frames
        )

        # -----------------------------
        # Yawning detection
        # -----------------------------

        if mar > self.mar_threshold:

            self.yawn_frames += 1

        else:

            self.yawn_frames = 0

        yawning = self.yawn_frames >= 10

        # -----------------------------
        # Head pose
        # -----------------------------

        head_down = head_status == "HEAD_DOWN"

        # -----------------------------
        # Combined score
        # -----------------------------

        score = 0

        if eyes_closed:
            score += 60

        elif ear < self.ear_threshold + 0.04:
            score += 20

        if yawning:
            score += 25

        elif mar > self.mar_threshold - 0.10:
            score += 10

        if head_down:
            score += 20

        score = min(score, 100)

        # -----------------------------
        # Final status
        # -----------------------------

        if score >= 60:

            status = "DROWSY"

        elif score >= 30:

            status = "WARNING"

        else:

            status = "SAFE"

        return {
            "status": status,
            "score": score,
            "eyes_closed": eyes_closed,
            "yawning": yawning,
            "head_down": head_down,
            "ear": round(ear, 3),
            "mar": round(mar, 3)
        }