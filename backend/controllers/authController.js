const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "driver_drowsiness_secret_2026",
        { expiresIn: "30d" }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, vehicleNumber, licenseNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your Name, Driver ID/Email, and Password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "A driver with this ID or Email is already registered. Please login instead."
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: role || "driver",
            phone: phone || "",
            vehicleNumber: vehicleNumber || "",
            licenseNumber: licenseNumber || ""
        });

        // Also register in Driver fleet roster
        await Driver.findOneAndUpdate(
            { email: normalizedEmail },
            {
                name,
                email: normalizedEmail,
                phone: phone || "",
                licenseNumber: licenseNumber || `DL-${Date.now().toString().slice(-6)}`,
                status: "ACTIVE"
            },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful! Welcome to DrowsyGuard.",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                licenseNumber: user.licenseNumber,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to register driver account",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your Driver ID / Email and Password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid Driver ID / Email or Password. Please check your credentials."
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                licenseNumber: user.licenseNumber,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Login failed, please try again",
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get driver profile",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
