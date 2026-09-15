const mongoose = require("mongoose");

const drowsinessEventSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            default: null
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        ear: {
            type: Number,
            default: 0
        },
        mar: {
            type: Number,
            default: 0
        },
        durationSeconds: {
            type: Number,
            default: 0
        },
        eventType: {
            type: String,
            enum: ["EYES_CLOSED", "YAWN", "HEAD_DOWN", "SEVERE_DROWSINESS"],
            default: "SEVERE_DROWSINESS"
        },
        alertTriggered: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("DrowsinessEvent", drowsinessEventSchema);
