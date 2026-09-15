# Driver Drowsiness IoT Detection & Safety Platform

> **An end-to-end IoT safety platform integrating AI Computer Vision (MediaPipe + OpenCV), an Express/MongoDB Backend, an interactive React Dashboard, and ESP32 Microcontroller Hardware for real-time driver fatigue monitoring and in-cabin alarms.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.10%2B-blue.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev)
[![ESP32](https://img.shields.io/badge/Hardware-ESP32_IoT-red.svg)](https://espressif.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-green.svg)](https://mongodb.com)

---

## 🌟 Key Features

1. **AI-Powered Computer Vision Microservice**:
   - **Eye Aspect Ratio (EAR)**: Real-time detection of eye closure and microsleep.
   - **Mouth Aspect Ratio (MAR)**: Continuous yawn tracking and frequency analysis.
   - **Head Pose Estimation**: 3D orientation tracking (`HEAD_DOWN`, `HEAD_UP`, `NORMAL`) using OpenCV `solvePnP`.
   - **Composite Drowsiness Score (0–100%)**: Weighted heuristic classifying driver state into `SAFE`, `WARNING`, and `DROWSY`.
   - **Direct MJPEG Video Stream**: Low-latency video streaming endpoint (`/api/camera/stream`).

2. **Enterprise Node.js Backend & MongoDB Storage**:
   - **RESTful API Suite**: Authentication, driver management, ESP32 device registry, detection logs, and safety alerts.
   - **Automated Incident Logging**: Critical drowsiness events automatically create unacknowledged alerts with timestamp and severity.
   - **Hardware Polling Endpoint**: `/api/devices/esp32/alert-status` specifically optimized for low-overhead microcontroller polling.

3. **In-Cabin ESP32 Hardware Module**:
   - Built on ESP32 DevKit V1 with built-in Wi-Fi and auto-reconnect.
   - **Multi-sensory Actuators**: High-pitch Piezo Buzzer alarm, Strobe Red Warning LED, and Steering/Seat Vibration Motor.
   - **Hardware Snooze Button**: 10-second manual interrupt mute for driver safety reset.

4. **Interactive Fleet Safety Web Dashboard**:
   - Real-time gauge and dynamic telemetry (EAR, MAR, Attention level).
   - Live fleet driver management with registration and status tracking.
   - ESP32 hardware device tracking with online/offline indicators.
   - Complete incident audit trail with one-click alert acknowledgment.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │  Driver / Cabin Webcam  │
                       └────────────┬────────────┘
                                    │ Video Frames
                                    ▼
                       ┌─────────────────────────┐
                       │   Python AI Service     │
                       │    (FastAPI: 8000)      │
                       │  • MediaPipe Face Mesh  │
                       │  • EAR / MAR / HeadPose │
                       └─────┬─────────────┬─────┘
                             │             │
        Asynchronous Alerts  │             │ Direct MJPEG Stream
       (POST /api/detections)│             │ (/api/camera/stream)
                             ▼             ▼
       ┌───────────────────────────┐    ┌───────────────────────────┐
       │   Express Backend (5000)  │◄───┤   React Frontend (Vite)   │
       │   • MongoDB Atlas Cloud   │    │   • Real-Time Gauge       │
       │   • JWT Authentication    │    │   • Fleet Driver Mgmt     │
       │   • Alert Engine          │    │   • Device Monitoring     │
       └─────────────┬─────────────┘    └───────────────────────────┘
                     │
                     │ HTTP Polling (1 Hz)
                     │ /api/devices/esp32/alert-status
                     ▼
       ┌───────────────────────────┐
       │     ESP32 IoT Module      │
       │  • Loud Piezo Buzzer      │
       │  • Strobe Warning LED     │
       │  • Tactile Vibration Motor│
       │  • Manual Mute Button     │
       └───────────────────────────┘
```

---

## 📁 Repository Structure

```
driver-drowsiness-iot/
├── ai-service/                # Python FastAPI computer vision microservice
│   ├── app/
│   │   ├── algorithms/        # Mathematical algorithms (EAR, MAR, Drowsiness score)
│   │   ├── camera/            # VideoCapture camera wrapper
│   │   ├── config/            # Settings and thresholds
│   │   ├── detection/         # MediaPipe FaceMesh & OpenCV Head Pose
│   │   ├── services/          # AlertService & IoTService HTTP dispatchers
│   │   └── main.py            # FastAPI entry point & detection loop
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # AI Service configuration
├── backend/                   # Node.js + Express + MongoDB REST API
│   ├── config/                # MongoDB Atlas connection (db.js)
│   ├── controllers/           # Auth, Driver, Device, Alert, Detection controllers
│   ├── middleware/            # JWT auth and error handling
│   ├── models/                # User, Driver, Device, Alert, Detection schemas
│   ├── routes/                # Express API route definitions
│   ├── utils/                 # Alert generation utility
│   ├── server.js              # Express app bootstrap
│   └── package.json
├── frontend/                  # React 18 + Vite Web Dashboard
│   ├── src/
│   │   ├── components/        # Gauge, Camera, Card, and Chart widgets
│   │   ├── context/           # AuthContext (JWT session management)
│   │   ├── pages/             # Dashboard, LiveMonitoring, Drivers, Alerts, Devices
│   │   ├── services/          # Axios API helper methods
│   │   ├── App.jsx            # Integrated interactive dashboard application
│   │   └── index.css          # CSS theme & layout design
│   └── package.json
├── esp32/                     # IoT Microcontroller Firmware & Documentation
│   ├── driver_alert/
│   │   └── driver_alert.ino   # Arduino C++ firmware for ESP32
│   └── README.md              # Circuit pinout and flashing guide
└── docs/                      # Technical Documentation
    ├── architecture.md        # Architectural flow and sequence diagrams
    ├── api.md                 # Complete REST API reference
    ├── database.md            # MongoDB data models & indexing
    └── project-report.md      # Full engineering project report
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **Python** (v3.10 or newer)
- **Git**
- **Webcam** (built-in or USB)
- *(Optional for hardware)* **ESP32 DevKit V1** and Arduino IDE

---

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server will launch at `http://localhost:5000`.

---

### 3. AI Service Setup
```bash
cd ai-service

# Create and activate virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The AI service API documentation is available at `http://127.0.0.1:8000/docs`.

---

### 4. Frontend Dashboard Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

### 5. ESP32 Hardware Flashing
1. Open `esp32/driver_alert/driver_alert.ino` in Arduino IDE.
2. Update your `WIFI_SSID`, `WIFI_PASSWORD`, and `BACKEND_HOST` (e.g. `http://192.168.1.100:5000`).
3. Connect your ESP32 via USB and click **Upload**.
4. Open the Serial Monitor at `115200` baud rate to view live hardware logs.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/health` | Backend health check |
| `POST` | `/api/auth/register` | Register new fleet user |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated profile |
| `GET` | `/api/drivers` | List all fleet drivers (with auto-seed) |
| `POST` | `/api/drivers` | Register a new driver |
| `DELETE` | `/api/drivers/:id` | Remove a driver record |
| `GET` | `/api/devices` | List registered ESP32 units |
| `POST` | `/api/devices` | Register/heartbeat an IoT device |
| `GET` | `/api/devices/esp32/alert-status` | **ESP32 polling endpoint** |
| `GET` | `/api/alerts` | List safety alerts |
| `PUT` | `/api/alerts/:id/ack` | Acknowledge an alert |
| `GET` | `/api/detections` | Fetch historical detection logs |
| `POST` | `/api/detections` | Submit detection from AI service |
| `GET` | `/api/dashboard/stats` | Aggregated system metrics |

---

## ⚖️ License
This project is licensed under the MIT License.
