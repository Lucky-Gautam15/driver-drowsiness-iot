const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },

        type: {
            type: String,
            enum: [
                "DROWSINESS",
                "EYES_CLOSED",
                "YAWNING",
                "HEAD_DOWN"
            ],
            required: true
        },

        message: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM"
        },

        score: {
            type: Number,
            default: 0
        },

        acknowledged: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Alert", alertSchema);