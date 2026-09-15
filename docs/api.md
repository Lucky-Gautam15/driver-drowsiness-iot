# REST API Reference - Driver Drowsiness IoT System

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register User
* **URL**: `/auth/register`
* **Method**: `POST`
* **Request Body**:
```json
{
  "name": "Fleet Admin",
  "email": "admin@fleet.com",
  "password": "Password123",
  "role": "admin",
  "phone": "+91 9876543210"
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6648...",
    "name": "Fleet Admin",
    "email": "admin@fleet.com",
    "role": "admin"
  }
}
```

### Login User
* **URL**: `/auth/login`
* **Method**: `POST`
* **Request Body**:
```json
{
  "email": "admin@fleet.com",
  "password": "Password123"
}
```

### Get Profile
* **URL**: `/auth/me`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <TOKEN>`

---

## 2. Detection Endpoints

### Save Detection
* **URL**: `/detections`
* **Method**: `POST`
* **Request Body**:
```json
{
  "score": 75,
  "status": "DROWSY",
  "ear": 0.17,
  "mar": 0.65,
  "headPose": "HEAD_DOWN",
  "eyesClosed": true,
  "yawning": true,
  "headDown": true
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Detection saved successfully",
  "detection": { ... },
  "alertGenerated": true,
  "alert": { ... }
}
```

### Get Detections
* **URL**: `/detections?limit=50`
* **Method**: `GET`

### Get Latest Detection
* **URL**: `/detections/latest`
* **Method**: `GET`

---

## 3. Alerts Endpoints

### List Alerts
* **URL**: `/alerts?unacknowledgedOnly=false`
* **Method**: `GET`

### Acknowledge Alert
* **URL**: `/alerts/:id/ack`
* **Method**: `PUT`
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Alert acknowledged successfully",
  "alert": {
    "_id": "6648...",
    "acknowledged": true
  }
}
```

---

## 4. Hardware ESP32 Endpoints

### Check Alert Status (ESP32 Polling)
* **URL**: `/devices/esp32/alert-status?deviceId=ESP32-001`
* **Method**: `GET`
* **Response (200 OK)**:
```json
{
  "deviceId": "ESP32-001",
  "alert": true,
  "buzzer": true,
  "led": true,
  "status": "DROWSY",
  "severity": "CRITICAL",
  "score": 85,
  "message": "Critical: Driver eyes closed for prolonged duration!",
  "timestamp": "2026-09-15T11:15:00.000Z"
}
```

---

## 5. Drivers & Devices Endpoints

### List Drivers
* **URL**: `/drivers`
* **Method**: `GET`

### Create Driver
* **URL**: `/drivers`
* **Method**: `POST`
* **Request Body**:
```json
{
  "name": "Rajesh Verma",
  "email": "rajesh@fleet.com",
  "phone": "+91 9988776655",
  "licenseNumber": "DL-142023000987",
  "status": "ACTIVE"
}
```

### List Devices
* **URL**: `/devices`
* **Method**: `GET`

### Dashboard Overview Stats
* **URL**: `/dashboard/stats`
* **Method**: `GET`
* **Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "drivers": { "total": 4, "active": 3 },
    "devices": { "total": 3, "online": 2 },
    "alerts": { "total": 12, "active": 1 },
    "averageScore": 24,
    "systemHealth": "Optimal"
  }
}
```
