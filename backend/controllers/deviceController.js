const Device = require("../models/Device");
const Alert = require("../models/Alert");
const Detection = require("../models/Detection");

const getDevices = async (req, res) => {
    try {
        let devices = await Device.find().populate("assignedDriver", "name email");

        // Seed default devices if none exist
        if (devices.length === 0) {
            const seedDevices = [
                {
                    deviceId: "ESP32-001",
                    name: "Cabin Safety Sensor A",
                    vehicleNumber: "VH-1024",
                    location: "Delhi Highway (NH-44)",
                    status: "Online",
                    signal: "Excellent"
                },
                {
                    deviceId: "ESP32-002",
                    name: "Cabin Safety Sensor B",
                    vehicleNumber: "VH-1032",
                    location: "Jaipur Express Highway",
                    status: "Online",
                    signal: "Good"
                },
                {
                    deviceId: "ESP32-003",
                    name: "Driver Alert Unit C",
                    vehicleNumber: "VH-1018",
                    location: "City Logistics Terminal",
                    status: "Offline",
                    signal: "No Signal"
                }
            ];

            devices = await Device.insertMany(seedDevices);
        }

        res.json({
            success: true,
            count: devices.length,
            devices
        });
    } catch (error) {
        console.error("Get devices error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch devices",
            error: error.message
        });
    }
};

const getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate("assignedDriver");
        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }
        res.json({ success: true, device });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch device",
            error: error.message
        });
    }
};

const registerDevice = async (req, res) => {
    try {
        const { deviceId, name, vehicleNumber, location, signal, assignedDriver } = req.body;

        if (!deviceId || !vehicleNumber) {
            return res.status(400).json({
                success: false,
                message: "Device ID and vehicle number are required"
            });
        }

        let device = await Device.findOne({ deviceId: deviceId.toUpperCase() });

        if (device) {
            device.name = name || device.name;
            device.vehicleNumber = vehicleNumber || device.vehicleNumber;
            device.location = location || device.location;
            device.signal = signal || device.signal;
            device.status = "Online";
            device.lastPing = new Date();
            if (assignedDriver) device.assignedDriver = assignedDriver;
            await device.save();
        } else {
            device = await Device.create({
                deviceId: deviceId.toUpperCase(),
                name: name || "ESP32 Alert Unit",
                vehicleNumber,
                location: location || "In-Transit",
                signal: signal || "Good",
                status: "Online",
                assignedDriver: assignedDriver || null
            });
        }

        res.status(201).json({
            success: true,
            message: "Device registered/updated successfully",
            device
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to register device",
            error: error.message
        });
    }
};

const deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }
        res.json({
            success: true,
            message: "Device deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete device",
            error: error.message
        });
    }
};

/**
 * ESP32 Hardware Polling & Heartbeat Endpoint
 * Called by ESP32 via HTTP GET /api/devices/esp32/alert-status?deviceId=ESP32-001
 */
const checkEsp32AlertStatus = async (req, res) => {
    try {
        const deviceId = (req.query.deviceId || "ESP32-001").toUpperCase();
        const clientIp = req.ip || req.connection.remoteAddress;

        // Update heartbeat and mark online
        await Device.findOneAndUpdate(
            { deviceId },
            {
                status: "Online",
                lastPing: new Date(),
                ipAddress: clientIp
            },
            { upsert: true }
        );

        // Check for recent unacknowledged alerts (within last 30 seconds)
        const recentTimeWindow = new Date(Date.now() - 30 * 1000);
        const unacknowledgedAlert = await Alert.findOne({
            acknowledged: false,
            createdAt: { $gte: recentTimeWindow }
        }).sort({ createdAt: -1 });

        // Also check latest detection
        const latestDetection = await Detection.findOne().sort({ createdAt: -1 });

        const isDrowsy =
            (latestDetection && (latestDetection.status === "DROWSY" || latestDetection.score >= 50)) ||
            !!unacknowledgedAlert;

        const alertActive = isDrowsy;
        const severity = unacknowledgedAlert ? unacknowledgedAlert.severity : (isDrowsy ? "HIGH" : "LOW");
        const score = latestDetection ? latestDetection.score : 0;

        res.json({
            deviceId,
            alert: alertActive,
            buzzer: alertActive,
            led: alertActive,
            status: isDrowsy ? "DROWSY" : "SAFE",
            severity,
            score,
            message: unacknowledgedAlert ? unacknowledgedAlert.message : (isDrowsy ? "Driver Drowsiness Alert" : "System Safe"),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("ESP32 alert status check error:", error.message);
        res.status(500).json({
            alert: false,
            buzzer: false,
            led: false,
            error: error.message
        });
    }
};

module.exports = {
    getDevices,
    getDeviceById,
    registerDevice,
    deleteDevice,
    checkEsp32AlertStatus
};
