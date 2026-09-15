import requests

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
            res = requests.get(url, timeout=1.5)
            return res.status_code == 200
        except Exception as err:
            print(f"[IoTService] Direct ESP32 ping failed: {err}")
            return False

iot_service = IoTService()
