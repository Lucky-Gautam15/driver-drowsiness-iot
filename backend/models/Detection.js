const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        status: {
            type: String,
            enum: ["SAFE", "WARNING", "DROWSY", "OFFLINE"],
            required: true
        },

        ear: {
            type: Number,
            default: 0
        },

        mar: {
            type: Number,
            default: 0
        },

        headPose: {
            type: String,
            default: "UNKNOWN"
        },

        eyesClosed: {
            type: Boolean,
            default: false
        },

        yawning: {
            type: Boolean,
            default: false
        },

        headDown: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Detection", detectionSchema);