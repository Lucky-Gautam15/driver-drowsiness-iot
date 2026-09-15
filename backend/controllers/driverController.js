const Driver = require("../models/Driver");

const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: drivers.length,
            drivers
        });
    } catch (error) {
        console.error("Get drivers error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch drivers",
            error: error.message
        });
    }
};

const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }
        res.json({
            success: true,
            driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch driver",
            error: error.message
        });
    }
};

const createDriver = async (req, res) => {
    try {
        const { name, email, phone, licenseNumber, status } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide driver name and email"
            });
        }

        const existing = await Driver.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Driver with this email/ID already exists"
            });
        }

        const driver = await Driver.create({
            name,
            email: email.toLowerCase(),
            phone,
            licenseNumber,
            status: status || "ACTIVE"
        });

        res.status(201).json({
            success: true,
            message: "Driver registered successfully",
            driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create driver",
            error: error.message
        });
    }
};

const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.json({
            success: true,
            message: "Driver updated successfully",
            driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update driver",
            error: error.message
        });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.json({
            success: true,
            message: "Driver deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete driver",
            error: error.message
        });
    }
};

module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};
