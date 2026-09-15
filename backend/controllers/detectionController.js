const Detection = require("../models/Detection");
const { createDrowsinessAlert } = require("../utils/alertUtils");

const createDetection = async (req, res) => {
    try {
        const {
            driver,
            score,
            status,
            ear,
            mar,
            headPose,
            eyesClosed,
            yawning,
            headDown
        } = req.body;

        const detection = await Detection.create({
            driver: driver || null,
            score,
            status,
            ear,
            mar,
            headPose,
            eyesClosed,
            yawning,
            headDown
        });

        // Automatically generate an Alert if drowsiness is detected
        let alert = null;
        if (status === "DROWSY" || score >= 50 || eyesClosed || headDown) {
            alert = await createDrowsinessAlert({
                driver: driver || null,
                score,
                ear,
                mar,
                headPose,
                eyesClosed,
                yawning,
                headDown
            });
        }

        res.status(201).json({
            success: true,
            message: "Detection saved successfully",
            detection,
            alertGenerated: !!alert,
            alert
        });

    } catch (error) {
        console.error("Detection save error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to save detection",
            error: error.message
        });
    }
};

const getDetections = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 50;
        const detections = await Detection.find()
            .populate("driver", "name email vehicleNumber")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            count: detections.length,
            detections
        });

    } catch (error) {
        console.error("Detection fetch error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch detections",
            error: error.message
        });
    }
};

const getLatestDetection = async (req, res) => {
    try {
        const latest = await Detection.findOne()
            .populate("driver", "name email vehicleNumber")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            detection: latest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch latest detection",
            error: error.message
        });
    }
};

module.exports = {
    createDetection,
    getDetections,
    getLatestDetection
};