const Alert = require("../models/Alert");

const createDrowsinessAlert = async ({ driver = null, score = 0, ear = 0, mar = 0, headPose = "UNKNOWN", eyesClosed = false, yawning = false, headDown = false }) => {
    try {
        let type = "DROWSINESS";
        let message = "Driver drowsiness detected";
        let severity = "MEDIUM";

        if (eyesClosed) {
            type = "EYES_CLOSED";
            message = "Critical: Driver eyes closed for prolonged duration!";
            severity = "CRITICAL";
        } else if (headDown) {
            type = "HEAD_DOWN";
            message = "Warning: Driver head tilted down / sleeping posture.";
            severity = "HIGH";
        } else if (yawning) {
            type = "YAWNING";
            message = "Warning: Driver is frequently yawning.";
            severity = "MEDIUM";
        } else if (score >= 70) {
            severity = "CRITICAL";
            message = "Danger: High level of driver fatigue detected!";
        } else if (score >= 50) {
            severity = "HIGH";
            message = "Alert: Significant signs of drowsiness.";
        }

        const alert = await Alert.create({
            driver,
            type,
            message,
            severity,
            score,
            acknowledged: false
        });

        return alert;
    } catch (error) {
        console.error("Failed to auto-create alert:", error.message);
        return null;
    }
};

module.exports = { createDrowsinessAlert };
