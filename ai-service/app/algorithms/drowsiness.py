class DrowsinessDetector:

    def __init__(
        self,
        ear_threshold=0.175,
        mar_threshold=0.60,
        max_closed_frames=14
    ):
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.max_closed_frames = max_closed_frames

        self.closed_frames = 0
        self.yawn_frames = 0
        self.head_down_frames = 0

        # Adaptive open-eye baseline tracking
        self.baseline_ear = 0.22
        self.adaptive_threshold = ear_threshold

        # Real-time Exponential Moving Average filters
        self.smoothed_ear = None
        self.smoothed_mar = None
        self.smoothed_score = 0.0

    def update(self, ear, mar, head_status, left_ear=None, right_ear=None):
        raw_ear = float(ear)
        raw_mar = float(mar)

        # -----------------------------
        # 0. Fast responsive smoothing
        # -----------------------------
        if self.smoothed_ear is None:
            self.smoothed_ear = raw_ear
        else:
            self.smoothed_ear = 0.45 * raw_ear + 0.55 * self.smoothed_ear

        if self.smoothed_mar is None:
            self.smoothed_mar = raw_mar
        else:
            self.smoothed_mar = 0.40 * raw_mar + 0.60 * self.smoothed_mar

        cur_ear = self.smoothed_ear
        cur_mar = self.smoothed_mar

        # -----------------------------
        # 1. Adaptive Baseline Tracking
        # -----------------------------
        max_ear = max(
            left_ear if left_ear is not None else cur_ear,
            right_ear if right_ear is not None else cur_ear
        )

        if max_ear > 0.17:
            self.baseline_ear = 0.95 * self.baseline_ear + 0.05 * max_ear

        # Closure threshold is 76% of baseline or at least 0.165
        self.adaptive_threshold = max(0.165, min(0.185, self.baseline_ear * 0.76))

        # -----------------------------
        # 2. Eye Closure Detection
        # -----------------------------
        is_closing = cur_ear < self.adaptive_threshold
        if left_ear is not None and right_ear is not None:
            is_closing = (cur_ear < self.adaptive_threshold) or (
                left_ear < self.adaptive_threshold and right_ear < self.adaptive_threshold
            )

        if is_closing:
            self.closed_frames += 1
        else:
            # Fast reset when eyes are open
            self.closed_frames = max(0, self.closed_frames - 4)

        eyes_closed = self.closed_frames >= self.max_closed_frames

        # -----------------------------
        # 3. Precise Eye Fatigue Score
        # -----------------------------
        eye_score = 0.0
        if self.closed_frames > 0:
            # Ramps up to 75% during initial closure frames
            fraction = min(1.0, self.closed_frames / float(self.max_closed_frames))
            eye_score = fraction * 75.0

            # Prolonged closure (Microsleep / Sleeping driver) escalates smoothly to 100.0%
            if self.closed_frames > self.max_closed_frames:
                extra = self.closed_frames - self.max_closed_frames
                escalation = min(1.0, extra / 10.0)
                eye_score = 75.0 + (escalation * 25.0)

        # -----------------------------
        # 4. Yawning Tracking
        # -----------------------------
        if cur_mar > self.mar_threshold:
            self.yawn_frames += 1
        else:
            self.yawn_frames = max(0, self.yawn_frames - 1)

        yawning = self.yawn_frames >= 6
        yawn_score = 0.0
        if yawning:
            intensity = min(1.0, (cur_mar - self.mar_threshold) / 0.15)
            yawn_score = 20.0 + (intensity * 15.0)

        # -----------------------------
        # 5. Head Pose Tracking
        # -----------------------------
        head_down = head_status == "HEAD_DOWN"
        if head_down:
            self.head_down_frames += 1
        else:
            self.head_down_frames = max(0, self.head_down_frames - 2)

        head_score = 0.0
        if head_down:
            tilt_ramp = min(1.0, self.head_down_frames / 6.0)
            head_score = 25.0 + (tilt_ramp * 25.0)

        # -----------------------------
        # 6. Composite Score Composition
        # -----------------------------
        if eyes_closed and head_down:
            target_score = 100.0  # Sleeping with head slumped is 100% danger
        elif eyes_closed:
            target_score = eye_score  # Scales from 75% -> 100.0%
        elif self.closed_frames > 0:
            target_score = eye_score + head_score * 0.5 + yawn_score * 0.5
        elif head_down:
            target_score = head_score
        elif yawning:
            target_score = yawn_score
        else:
            # EYES ARE OPEN, HEAD IS NORMAL, NO YAWNING -> EXACTLY 0.0!
            target_score = 0.0

        target_score = min(100.0, max(0.0, target_score))

        # Fast decay to 0 when awake, smooth climb when closing
        if target_score == 0.0:
            self.smoothed_score = max(0.0, self.smoothed_score - 15.0)
        else:
            self.smoothed_score = 0.40 * target_score + 0.60 * self.smoothed_score

        final_score = round(min(100.0, max(0.0, self.smoothed_score)), 1)
        if final_score < 0.5:
            final_score = 0.0

        # Status determination
        if final_score >= 50.0 or eyes_closed:
            status = "DROWSY"
        elif final_score >= 20.0 or yawning or head_down:
            status = "WARNING"
        else:
            status = "SAFE"

        return {
            "status": status,
            "score": final_score,
            "eyes_closed": eyes_closed,
            "yawning": yawning,
            "head_down": head_down,
            "ear": round(cur_ear, 3),
            "mar": round(cur_mar, 3),
            "threshold": round(self.adaptive_threshold, 3)
        }