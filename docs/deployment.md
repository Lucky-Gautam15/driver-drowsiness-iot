# 🚀 Production Deployment Guide: Driver Drowsiness IoT System

This guide explains how to deploy the entire **Driver Drowsiness IoT & AI Monitoring System** across Cloud and Edge environments.

---

## 🏗️ Architecture Overview

The system consists of 4 integrated components:

```
+---------------------+           +------------------------+
|  Hardware / IoT     |  HTTP     |   Backend API          |
|  (ESP32 Buzzer/LED) | <-------> |   (Node.js / Express)   | <---> [ MongoDB Atlas ]
+---------------------+           +------------------------+
                                              ^
                                              | REST / Alerts
+---------------------+           +------------------------+
|  Frontend Web App   |  WebRTC   |   Edge AI Service      |
|  (React / Vite)     | <-------> |   (FastAPI / OpenCV)   | <---> [ Vehicle Webcam ]
+---------------------+  Status   +------------------------+
```

| Component | Technology | Recommended Host | Production URL Example |
| :--- | :--- | :--- | :--- |
| **Backend API** | Node.js + Express | **Render.com** / **Railway** | `https://driver-drowsiness-api.onrender.com` |
| **Database** | MongoDB Atlas Cloud | **MongoDB Atlas** (Free M0) | `mongodb+srv://...` |
| **Frontend Web App** | React 18 + Vite | **Vercel** / **Netlify** | `https://driver-drowsiness.vercel.app` |
| **AI Vision Service** | Python FastAPI + MediaPipe | **Vehicle Edge Device / Local / AWS** | In-Cabin Device / `http://localhost:8000` |
| **IoT Alert Module** | ESP32 Microcontroller | **Vehicle 12V/5V In-Cabin** | Direct Wi-Fi HTTP polling |

---

## 1️⃣ Deploy Backend (Render.com)

1. Sign up at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `Lucky-Gautam15/driver-drowsiness-iot`.
4. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://luckygautam90582_db_user:Lucky10195@cluster0.iucyfbp.mongodb.net/driver_drowsiness?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `driver_drowsiness_secret_2026`
6. Click **Deploy Web Service**.
7. Note your live backend URL (e.g. `https://driver-drowsiness-api.onrender.com`).

---

## 2️⃣ Deploy Frontend (Vercel)

1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `Lucky-Gautam15/driver-drowsiness-iot`.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://driver-drowsiness-api.onrender.com/api` (your Render backend URL)
   - `VITE_AI_URL`: `http://localhost:8000` (or your edge device IP address)
6. Click **Deploy**.
7. Your frontend is now live on the internet with global CDN!

---

## 3️⃣ Deploy AI Vision Service

> [!NOTE]
> **Why the AI service runs on the vehicle machine:**
> Computer vision requires direct access to the driver cabin's webcam (`cv2.VideoCapture(0)`). Standard cloud servers (like Vercel or Render free tier) do NOT have physical cameras attached. Therefore, the AI service runs on the vehicle's onboard laptop, Raspberry Pi 4/5, or in-cabin computer.

### Running on Vehicle Laptop / In-Cabin PC:
1. Open PowerShell / Terminal in `ai-service`:
   ```bash
   cd ai-service
   .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
2. Set `.env` to point alerts to your live cloud backend:
   ```env
   BACKEND_URL=https://driver-drowsiness-api.onrender.com/api
   ```

### Running with Docker (Linux / Raspberry Pi / AWS EC2):
A `Dockerfile` can be used to run on Ubuntu / Raspberry Pi:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4️⃣ Connecting ESP32 Hardware in Vehicle

1. In `esp32/firmware.ino` or `esp32/config.h`:
   - Set your vehicle Wi-Fi SSID and Password (or mobile hotspot).
   - Set `serverUrl`:
     ```cpp
     const char* serverUrl = "https://driver-drowsiness-api.onrender.com/api/devices/esp32/alert-status";
     ```
2. Flash the code to your ESP32 board via Arduino IDE.
3. Power the ESP32 via USB in the vehicle. It will sound buzzer alarms and flash LEDs whenever drowsiness is detected by the AI.

---

## ✅ Deployment Readiness Checklist

| Item | Status | Notes |
| :--- | :---: | :--- |
| **MongoDB Atlas** | ✅ READY | Cloud database active and connected |
| **Node.js Backend** | ✅ READY | CORS enabled, health route `/api/health` ready, Render compatible |
| **React Frontend** | ✅ READY | Production build passes (`dist/` 766KB), environment variables ready for Vercel |
| **AI Computer Vision** | ✅ READY | Calibrated thresholds, cross-platform camera support, 60 FPS MediaPipe |
| **Cross-Platform Camera** | ✅ READY | Windows DirectShow & Linux V4L2 supported |
| **ESP32 IoT Alerts** | ✅ READY | HTTP polling firmware ready |
