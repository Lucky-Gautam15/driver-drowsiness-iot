class DrowsinessDetector:

    def __init__(
        self,
        ear_threshold=0.22,
        mar_threshold=0.60,
        max_closed_frames=12
    ):
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.max_closed_frames = max_closed_frames

        self.closed_frames = 0
        self.yawn_frames = 0
        self.head_down_frames = 0

        # Real-time Exponential Moving Average filters to eliminate webcam sensor noise
        self.smoothed_ear = None
        self.smoothed_mar = None
        self.smoothed_score = 0.0

    def update(self, ear, mar, head_status):
        # -----------------------------
        # 0. Temporal EMA Smoothing (Eliminates frame-to-frame random jitter)
        # -----------------------------
        if self.smoothed_ear is None:
            self.smoothed_ear = float(ear)
        else:
            # Alpha = 0.4 enables snappy blink tracking while smoothing frame noise
            self.smoothed_ear = 0.40 * float(ear) + 0.60 * self.smoothed_ear

        if self.smoothed_mar is None:
            self.smoothed_mar = float(mar)
        else:
            self.smoothed_mar = 0.35 * float(mar) + 0.65 * self.smoothed_mar

        cur_ear = self.smoothed_ear
        cur_mar = self.smoothed_mar

        # -----------------------------
        # 1. Eye Closure Tracking
        # -----------------------------
        if cur_ear < self.ear_threshold:
            self.closed_frames += 1
        else:
            # Gradual recovery when eyes open
            self.closed_frames = max(0, self.closed_frames - 2)

        eyes_closed = self.closed_frames >= self.max_closed_frames

        # Eye Score Calculation (0.0 to 100.0 scale)
        eye_score = 0.0

        # Phase A: Mild Eyelid Droop (pre-closure fatigue warning)
        if cur_ear < 0.28:
            droop_progress = max(0.0, min(1.0, (0.28 - cur_ear) / (0.28 - self.ear_threshold)))
            eye_score += droop_progress * 25.0

        # Phase B & C: Closed frames ramping to 100%
        if self.closed_frames > 0:
            # Initial ramp up to max_closed_frames (adds up to 40%)
            ramp = min(1.0, self.closed_frames / float(self.max_closed_frames))
            eye_score += ramp * 40.0

            # Phase C: Prolonged Closure (Microsleep / Asleep driver)
            # Extends all the way to 100.0% (previously capped at 75%)
            if self.closed_frames > self.max_closed_frames:
                extra_frames = self.closed_frames - self.max_closed_frames
                # Full 100% within ~15 additional frames (~0.5 - 0.7 sec prolonged closure)
                escalation = min(1.0, extra_frames / 15.0)
                eye_score = 65.0 + (escalation * 35.0)

        # -----------------------------
        # 2. Yawning Tracking
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
        # 3. Head Pose Tracking
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
        # 4. Composite Score with Full 0.0% - 100.0% Range
        # -----------------------------
        if eyes_closed and head_down:
            # Sleeping + Head tilt is an immediate critical hazard
            target_score = max(88.0, min(100.0, eye_score + head_score * 0.7))
        elif eyes_closed:
            # Eyes closed alone scales up to 100%
            target_score = eye_score
        else:
            # Normal combined awake fatigue index
            target_score = eye_score + yawn_score + head_score

        # Clamp between 0.0 and 100.0
        target_score = min(100.0, max(0.0, target_score))

        # Smooth output progression for stable real-time display
        self.smoothed_score = 0.35 * target_score + 0.65 * self.smoothed_score
        final_score = round(min(100.0, max(0.0, self.smoothed_score)), 1)

        # -----------------------------
        # 5. Final Alert Status
        # -----------------------------
        if final_score >= 55.0 or eyes_closed or (head_down and self.head_down_frames >= 10):
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
            "mar": round(cur_mar, 3)
        }