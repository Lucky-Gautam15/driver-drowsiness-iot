const express = require("express");
const {
    getDevices,
    getDeviceById,
    registerDevice,
    deleteDevice,
    checkEsp32AlertStatus
} = require("../controllers/deviceController");

const router = express.Router();

router.get("/", getDevices);
router.get("/esp32/alert-status", checkEsp32AlertStatus);
router.get("/:id", getDeviceById);
router.post("/", registerDevice);
router.delete("/:id", deleteDevice);

module.exports = router;
