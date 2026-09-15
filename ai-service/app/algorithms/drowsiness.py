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
        # 1. Eye Closure Tracking
        # -----------------------------
        if ear < self.ear_threshold:
            self.closed_frames += 1
        else:
            self.closed_frames = max(0, self.closed_frames - 2)

        eyes_closed = self.closed_frames >= self.max_closed_frames

        # Continuous Eye Fatigue Component (0.0 to 55.0)
        # Tracks subtle eyelid drooping smoothly before and during closure
        eye_score = 0.0
        if ear < 0.30:
            droop_ratio = max(0.0, min(1.0, (0.30 - ear) / (0.30 - self.ear_threshold)))
            eye_score += droop_ratio * 20.0

        if self.closed_frames > 0:
            closure_ratio = min(1.0, self.closed_frames / float(self.max_closed_frames))
            eye_score += closure_ratio * 35.0

        # -----------------------------
        # 2. Yawning Tracking
        # -----------------------------
        if mar > self.mar_threshold:
            self.yawn_frames += 1
        else:
            self.yawn_frames = max(0, self.yawn_frames - 1)

        yawning = self.yawn_frames >= 8

        # Continuous Yawn/Mouth Fatigue Component (0.0 to 25.0)
        yawn_score = 0.0
        if mar > 0.42:
            open_ratio = max(0.0, min(1.0, (mar - 0.42) / (self.mar_threshold - 0.42)))
            yawn_score += open_ratio * 10.0

        if mar >= self.mar_threshold:
            yawn_intensity = min(1.0, (mar - self.mar_threshold) / 0.20)
            yawn_score += 5.0 + (yawn_intensity * 10.0)

        # -----------------------------
        # 3. Head Pose Tracking
        # -----------------------------
        head_down = head_status == "HEAD_DOWN"
        head_up = head_status == "HEAD_UP"

        head_score = 0.0
        if head_down:
            head_score = 20.0
        elif head_up:
            head_score = 8.0

        # -----------------------------
        # 4. Composite Continuous Score (0.0 - 100.0)
        # -----------------------------
        total_score = min(100.0, eye_score + yawn_score + head_score)
        score = round(total_score, 1)

        # -----------------------------
        # 5. Final Alert Status
        # -----------------------------
        if score >= 55.0 or eyes_closed:
            status = "DROWSY"
        elif score >= 28.0 or yawning or head_down:
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