import urllib.request
import urllib.error

class IoTService:
    def __init__(self):
        pass

    def trigger_esp32_alarm(self, esp32_ip, duration_ms=2000):
        """
        Directly sends an alarm trigger to the ESP32 IP if on the same local network.
        """
        if not esp32_ip:
            return False
        try:
            url = f"http://{esp32_ip}/alarm?duration={duration_ms}"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=1.5) as response:
                return response.status == 200
        except Exception as err:
            print(f"[IoTService] Direct ESP32 ping failed: {err}")
            return False

iot_service = IoTService()
