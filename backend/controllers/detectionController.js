const Detection = require("../models/Detection");

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

        res.status(201).json({
            success: true,
            message: "Detection saved successfully",
            detection
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
        const detections = await Detection.find()
            .populate("driver")
            .sort({ createdAt: -1 })
            .limit(100);

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


module.exports = {
    createDetection,
    getDetections
};