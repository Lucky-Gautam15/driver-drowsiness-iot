const express = require("express");

const {
    createDetection,
    getDetections,
    getLatestDetection
} = require("../controllers/detectionController");

const router = express.Router();

router.post("/", createDetection);
router.get("/", getDetections);
router.get("/latest", getLatestDetection);

module.exports = router;