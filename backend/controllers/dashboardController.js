const Driver = require("../models/Driver");
const Device = require("../models/Device");
const Alert = require("../models/Alert");
const Detection = require("../models/Detection");

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalDrivers,
            activeDrivers,
            totalDevices,
            onlineDevices,
            totalAlerts,
            unacknowledgedAlerts,
            recentDetections,
            recentAlerts
        ] = await Promise.all([
            Driver.countDocuments(),
            Driver.countDocuments({ status: "ACTIVE" }),
            Device.countDocuments(),
            Device.countDocuments({ status: "Online" }),
            Alert.countDocuments(),
            Alert.countDocuments({ acknowledged: false }),
            Detection.find().sort({ createdAt: -1 }).limit(10),
            Alert.find().sort({ createdAt: -1 }).limit(5)
        ]);

        // Calculate average fatigue/safety score from recent detections
        let avgScore = 0;
        if (recentDetections.length > 0) {
            const sum = recentDetections.reduce((acc, curr) => acc + (curr.score || 0), 0);
            avgScore = Math.round(sum / recentDetections.length);
        }

        res.json({
            success: true,
            stats: {
                drivers: {
                    total: totalDrivers,
                    active: activeDrivers
                },
                devices: {
                    total: totalDevices,
                    online: onlineDevices
                },
                alerts: {
                    total: totalAlerts,
                    active: unacknowledgedAlerts
                },
                averageScore: avgScore,
                systemHealth: "Optimal"
            },
            recentDetections,
            recentAlerts
        });
    } catch (error) {
        console.error("Dashboard stats error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};
