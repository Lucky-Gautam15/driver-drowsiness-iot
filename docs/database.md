# Database Architecture & Schemas - MongoDB Atlas

The backend uses **Mongoose (v9)** to manage MongoDB schemas and relationships.

---

## 1. Collection Schemas

### 1.1 `users`
Stores fleet administrators and dispatchers.
* `name`: String (required, trimmed)
* `email`: String (required, unique, lowercase)
* `password`: String (bcrypt hashed)
* `role`: Enum `["admin", "driver", "fleet_manager"]` (default: `"admin"`)
* `phone`: String
* `timestamps`: `createdAt`, `updatedAt`

---

### 1.2 `drivers`
Stores professional driver identities and credentials.
* `name`: String (required, trimmed)
* `email`: String (required, unique, lowercase)
* `phone`: String
* `licenseNumber`: String
* `status`: Enum `["ACTIVE", "INACTIVE"]` (default: `"ACTIVE"`)
* `timestamps`: `createdAt`, `updatedAt`

---

### 1.3 `devices`
Stores in-cabin ESP32 IoT hardware units.
* `deviceId`: String (required, unique, uppercase, e.g. `"ESP32-001"`)
* `name`: String
* `vehicleNumber`: String (required)
* `location`: String
* `status`: Enum `["Online", "Offline"]` (default: `"Offline"`)
* `signal`: Enum `["Excellent", "Good", "Weak", "No Signal"]`
* `ipAddress`: String
* `lastPing`: Date (updated on each hardware heartbeat)
* `assignedDriver`: ObjectId (Reference -> `Driver`)
* `timestamps`: `createdAt`, `updatedAt`

---

### 1.4 `detections`
High-frequency telemetry submitted by the Python perception microservice.
* `driver`: ObjectId (Reference -> `Driver`, optional)
* `score`: Number (`0 - 100`, required)
* `status`: Enum `["SAFE", "WARNING", "DROWSY", "OFFLINE"]`
* `ear`: Number (Eye Aspect Ratio, float)
* `mar`: Number (Mouth Aspect Ratio, float)
* `headPose`: String (e.g. `"HEAD_DOWN"`, `"NORMAL"`)
* `eyesClosed`: Boolean
* `yawning`: Boolean
* `headDown`: Boolean
* `timestamps`: `createdAt`, `updatedAt`

---

### 1.5 `alerts`
Critical incidents requiring supervisor visibility or hardware alarm triggering.
* `driver`: ObjectId (Reference -> `Driver`, optional)
* `type`: Enum `["DROWSINESS", "EYES_CLOSED", "YAWNING", "HEAD_DOWN"]`
* `message`: String (required)
* `severity`: Enum `["LOW", "MEDIUM", "HIGH", "CRITICAL"]`
* `score`: Number
* `acknowledged`: Boolean (default: `false`)
* `timestamps`: `createdAt`, `updatedAt`

---

### 1.6 `drowsinessevents`
Detailed session tracking events for analytics and compliance reports.
* `driver`: ObjectId (Reference -> `Driver`)
* `device`: ObjectId (Reference -> `Device`)
* `score`: Number
* `ear`: Number
* `mar`: Number
* `durationSeconds`: Number
* `eventType`: Enum `["EYES_CLOSED", "YAWN", "HEAD_DOWN", "SEVERE_DROWSINESS"]`
* `alertTriggered`: Boolean
* `timestamps`: `createdAt`, `updatedAt`

---

## 2. Indexing Strategy
* `users.email`: Unique index for constant time lookups.
* `devices.deviceId`: Unique index for fast ESP32 lookup during 1-second polling.
* `detections.createdAt`: Descending index for rapid retrieval of latest telemetry.
* `alerts.acknowledged` & `alerts.createdAt`: Compound index for instant active alert retrieval.
