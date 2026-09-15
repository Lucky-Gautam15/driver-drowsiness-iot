# ESP32 Driver Alert Hardware Module

This directory contains the firmware for the in-cabin **ESP32 IoT Alert Module**. When the AI vision microservice detects driver fatigue, the backend flags the status as `DROWSY` and the ESP32 activates real-time physical actuators (Loud Buzzer, Strobe Warning LED, Vibration Motor).

---

## 🛠️ Components Required

| Component | Quantity | Purpose |
|---|:---:|---|
| **ESP32 DevKit V1** (30/38 pin) | 1 | Microcontroller with built-in Wi-Fi |
| **Active 5V Buzzer** | 1 | High-pitch audible alarm |
| **Red Warning LED (5mm)** | 1 | High-visibility strobe flash |
| **Green Status LED (5mm)** | 1 | Wi-Fi and system health indicator |
| **Vibration Motor (3V-5V)** | 1 | Tactile steering wheel/seat alert |
| **2N2222 NPN Transistor** | 1 | Driver for vibration motor |
| **220Ω Resistors** | 2 | Current limiting for LEDs |
| **1kΩ Resistor** | 1 | Base resistor for transistor |
| **Push Button (Momentary)** | 1 | Manual 10-second alert mute / snooze |
| **Breadboard & Jumper Wires** | - | Prototyping & connections |

---

## 🔌 Hardware Pinout Configuration

| ESP32 GPIO | Component Pin | Notes |
|:---:|---|---|
| **GPIO 18** | Buzzer (+) | Anode to GPIO 18, Cathode to GND |
| **GPIO 19** | Red Alert LED (+) | Via 220Ω resistor to GND |
| **GPIO 21** | Green Status LED (+) | Via 220Ω resistor to GND |
| **GPIO 22** | Vibration Motor Base | Via 1kΩ resistor to 2N2222 base |
| **GPIO 4** | Mute Button (One leg) | Other leg connected to GND (Internal Pullup) |
| **GND** | Ground Rail | Common GND |
| **VIN / 5V** | 5V Rail | Power supply from USB or vehicle 5V adapter |

---

## 💻 Arduino IDE Setup Guide

1. **Install Arduino IDE** (version 2.0 or newer).
2. Go to **File** -> **Preferences** -> **Additional Boards Manager URLs** and add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Open **Tools** -> **Board** -> **Boards Manager**, search for `esp32`, and install `esp32 by Espressif Systems`.
4. Select your board:
   - **Board**: `DOIT ESP32 DEVKIT V1` (or your specific ESP32 board).
   - **Upload Speed**: `921600` or `115200`.
   - **Port**: Select your USB COM port (e.g. `COM3` / `COM4`).

---

## ⚙️ Configuration & Uploading

1. Open [`esp32/driver_alert/driver_alert.ino`](./driver_alert/driver_alert.ino) in Arduino IDE.
2. Update the network credentials:
   ```cpp
   const char* WIFI_SSID     = "Your_WiFi_Name";
   const char* WIFI_PASSWORD = "Your_WiFi_Password";
   ```
3. Update the Backend IP address to your computer's local IP address (find using `ipconfig` on Windows or `ifconfig` on Linux):
   ```cpp
   const char* BACKEND_HOST  = "http://192.168.1.100:5000";
   ```
4. Click **Upload** (Arrow icon).
5. Open **Serial Monitor** at baud rate `115200` to observe the boot logs and sync stream:
   ```
   ==================================================
      DRIVER DROWSINESS IoT ALERT MODULE - ESP32     
   ==================================================
   [TEST] Running hardware actuator test...
   [TEST] Hardware ready.
   [WIFI] Connecting to Your_WiFi_Name....
   [WIFI] Connected successfully!
   [WIFI] ESP32 Assigned IP: 192.168.1.150
   [IOT-SYNC] Status: SAFE     | Score:  12% | Alert: NORMAL
   [IOT-SYNC] Status: DROWSY   | Score:  78% | Alert: TRIGGERED (ACTIVE)
   ```
