const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: [true, "Device ID is required"],
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            default: "ESP32 Alert Unit"
        },
        vehicleNumber: {
            type: String,
            required: [true, "Vehicle number is required"],
            trim: true
        },
        location: {
            type: String,
            default: "In-Transit"
        },
        status: {
            type: String,
            enum: ["Online", "Offline"],
            default: "Offline"
        },
        signal: {
            type: String,
            enum: ["Excellent", "Good", "Weak", "No Signal"],
            default: "Good"
        },
        ipAddress: {
            type: String,
            default: ""
        },
        lastPing: {
            type: Date,
            default: Date.now
        },
        assignedDriver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Device", deviceSchema);
