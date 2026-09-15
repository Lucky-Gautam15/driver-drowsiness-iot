const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const detectionRoutes = require("./routes/detectionRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Root & Health Check
// ==========================================

app.get("/", (req, res) => {
    res.json({
        name: "Driver Drowsiness IoT Backend API",
        status: "running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            drivers: "/api/drivers",
            devices: "/api/devices",
            alerts: "/api/alerts",
            detections: "/api/detections",
            dashboard: "/api/dashboard/stats",
            esp32Poll: "/api/devices/esp32/alert-status"
        }
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "backend",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/detections", detectionRoutes);

// ==========================================
// Error Handlers
// ==========================================

app.use(notFound);
app.use(errorHandler);

// ==========================================
// Server Startup
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
            console.log(`API documentation index: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();