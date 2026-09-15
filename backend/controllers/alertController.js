const Alert = require("../models/Alert");

const getAlerts = async (req, res) => {
    try {
        const { unacknowledgedOnly } = req.query;
        const query = unacknowledgedOnly === "true" ? { acknowledged: false } : {};

        const alerts = await Alert.find(query)
            .populate("driver", "name email vehicleNumber")
            .sort({ createdAt: -1 })
            .limit(50);

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
