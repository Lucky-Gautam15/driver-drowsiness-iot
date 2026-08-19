const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const detectionRoutes = require("./routes/detectionRoutes");

dotenv.config();

const app = express();


// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// Root Route
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "Driver Drowsiness Backend API",
        status: "running"
    });
});


// ==========================================
// Health Check
// ==========================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "backend"
    });
});


// ==========================================
// Detection Routes
// ==========================================

app.use("/api/detections", detectionRoutes);


// ==========================================
// Server
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(
                `Backend running on http://localhost:${PORT}`
            );

            console.log(
                `Detection API: http://localhost:${PORT}/api/detections`
            );

        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();