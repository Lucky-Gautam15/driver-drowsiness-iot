class DrowsinessDetector:

    def __init__(
        self,
        ear_threshold=0.165,
        mar_threshold=0.60,
        max_closed_frames=18
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
        # -----------------------------
        # 0. Temporal EMA Smoothing
        # -----------------------------
        if self.smoothed_ear is None:
            self.smoothed_ear = float(ear)
        else:
            self.smoothed_ear = 0.35 * float(ear) + 0.65 * self.smoothed_ear

        if self.smoothed_mar is None:
            self.smoothed_mar = float(mar)
        else:
            self.smoothed_mar = 0.35 * float(mar) + 0.65 * self.smoothed_mar

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
            # Gradually adapt baseline to the individual's eye geometry
            self.baseline_ear = 0.96 * self.baseline_ear + 0.04 * max_ear

        # Dynamic closure threshold: 68% of baseline, bounded between 0.135 and 0.175
        self.adaptive_threshold = min(0.175, max(0.135, self.baseline_ear * 0.68))

        # -----------------------------
        # 2. Dual-Eye Closure Detection
        # -----------------------------
        if left_ear is not None and right_ear is not None:
            # If at least one eye is clearly open, driver is watching the road
            is_closing = (cur_ear < self.adaptive_threshold) and not (max(left_ear, right_ear) > self.adaptive_threshold + 0.04)
        else:
            is_closing = cur_ear < self.adaptive_threshold

        if is_closing:
            self.closed_frames += 1
        else:
            # Fast recovery when eyes are open
            self.closed_frames = max(0, self.closed_frames - 3)

        eyes_closed = self.closed_frames >= self.max_closed_frames

        # -----------------------------
        # 3. Eye Score Calculation
        # -----------------------------
        eye_score = 0.0

        # Eyelid Droop only activates right above the closure threshold (not on wide open eyes)
        droop_boundary = self.adaptive_threshold + 0.035
        if cur_ear < droop_boundary and not eyes_closed:
            droop_progress = max(0.0, min(1.0, (droop_boundary - cur_ear) / 0.035))
            eye_score += droop_progress * 20.0

        if self.closed_frames > 0:
            # Ramp during closing
            ramp = min(1.0, self.closed_frames / float(self.max_closed_frames))
            eye_score += ramp * 45.0

            # Prolonged closure (Microsleep) escalates to 100%
            if self.closed_frames > self.max_closed_frames:
                extra_frames = self.closed_frames - self.max_closed_frames
                escalation = min(1.0, extra_frames / 15.0)
                eye_score = 65.0 + (escalation * 35.0)

        # -----------------------------
        # 4. Yawning Tracking
        # -----------------------------
        if cur_mar > self.mar_threshold:
            self.yawn_frames += 1
        else:
            self.yawn_frames = max(0, self.yawn_frames - 1)

        yawning = self.yawn_frames >= 6

        yawn_score = 0.0
        if cur_mar > 0.45:
            open_ratio = max(0.0, min(1.0, (cur_mar - 0.45) / (self.mar_threshold - 0.45)))
            yawn_score += open_ratio * 15.0

        if yawning:
            intensity = min(1.0, (cur_mar - self.mar_threshold) / 0.20)
            yawn_score += 15.0 + (intensity * 15.0)

        # -----------------------------
        # 5. Head Pose Tracking
        # -----------------------------
        head_down = head_status == "HEAD_DOWN"
        head_up = head_status == "HEAD_UP"

        if head_down:
            self.head_down_frames += 1
        else:
            self.head_down_frames = max(0, self.head_down_frames - 2)

        head_score = 0.0
        if head_down:
            tilt_ramp = min(1.0, self.head_down_frames / 8.0)
            head_score = 25.0 + (tilt_ramp * 15.0)
        elif head_up:
            head_score = 10.0

        # -----------------------------
        # 6. Composite Score
        # -----------------------------
        if eyes_closed and head_down:
            target_score = max(88.0, min(100.0, eye_score + head_score * 0.7))
        elif eyes_closed:
            target_score = eye_score
        else:
            target_score = eye_score + yawn_score + head_score

        target_score = min(100.0, max(0.0, target_score))

        # Smooth output progression
        self.smoothed_score = 0.35 * target_score + 0.65 * self.smoothed_score
        final_score = round(min(100.0, max(0.0, self.smoothed_score)), 1)

        # -----------------------------
        # 7. Final Alert Status
        # -----------------------------
        if final_score >= 55.0 or eyes_closed or (head_down and self.head_down_frames >= 12):
            status = "DROWSY"
        elif final_score >= 25.0 or yawning or head_down:
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