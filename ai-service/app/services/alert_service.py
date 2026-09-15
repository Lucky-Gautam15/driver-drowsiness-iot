import time
import json
import threading
import urllib.request
import urllib.error
from app.config import settings

class AlertService:
    def __init__(self):
        self.last_alert_time = 0
        self.last_safe_sync_time = 0
        self.cooldown = settings.ALERT_COOLDOWN_SECONDS
        self.backend_url = settings.BACKEND_URL

    def notify_detection(self, detection_payload):
        """
        Dispatches detection to backend in a non-blocking background thread.
        Drowsy / warning states are dispatched with a cooldown.
        Periodic safe syncs are dispatched every 30 seconds.
        """
        status = detection_payload.get("status", "SAFE")
        score = detection_payload.get("score", 0)
        current_time = time.time()

        is_critical = status in ["DROWSY", "WARNING"] or score >= 50 or detection_payload.get("eyes_closed", False)

        should_send = False
        if is_critical and (current_time - self.last_alert_time >= self.cooldown):
            self.last_alert_time = current_time
            should_send = True
        elif not is_critical and (current_time - self.last_safe_sync_time >= 30):
            self.last_safe_sync_time = current_time
            should_send = True

        if should_send:
            thread = threading.Thread(
                target=self._send_payload,
                args=(detection_payload,),
                daemon=True
            )
            thread.start()

    def _send_payload(self, payload):
        try:
            url = f"{self.backend_url}/detections"
            formatted_payload = {
                "score": payload.get("score", 0),
                "status": payload.get("status", "SAFE"),
                "ear": payload.get("ear", 0.0),
                "mar": payload.get("mar", 0.0),
                "headPose": payload.get("head_pose", "UNKNOWN"),
                "eyesClosed": payload.get("eyes_closed", False),
                "yawning": payload.get("yawning", False),
                "headDown": payload.get("head_down", False)
            }
            data = json.dumps(formatted_payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=2.5) as response:
                if response.status in [200, 201]:
                    print(f"[AlertService] Detection synced with backend: Status={payload.get('status')}")
                else:
                    print(f"[AlertService] Backend returned HTTP {response.status}")
        except urllib.error.URLError as err:
            # Backend may still be spinning up
            print(f"[AlertService] Backend unreachable: {err}")
        except Exception as err:
            print(f"[AlertService] Could not sync with backend: {err}")

alert_service = AlertService()
