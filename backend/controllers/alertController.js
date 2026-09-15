const Alert = require("../models/Alert");

const getAlerts = async (req, res) => {
    try {
        const { unacknowledgedOnly } = req.query;
        const query = unacknowledgedOnly === "true" ? { acknowledged: false } : {};

        let alerts = await Alert.find(query)
            .populate("driver", "name email vehicleNumber")
            .sort({ createdAt: -1 })
            .limit(50);

        if (alerts.length === 0 && unacknowledgedOnly !== "true") {
            const seedAlerts = [
                {
                    type: "DROWSINESS",
                    message: "Driver eyes remained closed for 3.1 seconds.",
                    severity: "CRITICAL",
                    score: 85,
                    acknowledged: false
                },
                {
                    type: "YAWNING",
                    message: "Multiple yawning events detected within 60 seconds.",
                    severity: "HIGH",
                    score: 65,
                    acknowledged: true
                },
                {
                    type: "HEAD_DOWN",
                    message: "Driver head tilt downwards detected.",
                    severity: "MEDIUM",
                    score: 45,
                    acknowledged: true
                },
                {
                    type: "EYES_CLOSED",
                    message: "Eye Aspect Ratio (EAR) dropped below 0.18.",
                    severity: "HIGH",
                    score: 70,
                    acknowledged: true
                }
            ];

            alerts = await Alert.insertMany(seedAlerts);
        }

        res.json({
            success: true,
            count: alerts.length,
            alerts
        });
    } catch (error) {
        console.error("Get alerts error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts",
            error: error.message
        });
    }
};

const acknowledgeAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { acknowledged: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        res.json({
            success: true,
            message: "Alert acknowledged successfully",
            alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to acknowledge alert",
            error: error.message
        });
    }
};

const createAlert = async (req, res) => {
    try {
        const { driver, type, message, severity, score } = req.body;

        const alert = await Alert.create({
            driver: driver || null,
            type: type || "DROWSINESS",
            message: message || "Driver Drowsiness Alert",
            severity: severity || "HIGH",
            score: score || 60,
            acknowledged: false
        });

        res.status(201).json({
            success: true,
            message: "Alert triggered successfully",
            alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to trigger alert",
            error: error.message
        });
    }
};

module.exports = {
    getAlerts,
    acknowledgeAlert,
    createAlert
};
