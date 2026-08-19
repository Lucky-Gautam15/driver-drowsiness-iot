const express = require("express");

const {
    createDetection,
    getDetections
} = require("../controllers/detectionController");

const router = express.Router();

router.post("/", createDetection);

router.get("/", getDetections);

module.exports = router;