const express = require("express");
const {
    getAlerts,
    acknowledgeAlert,
    createAlert
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", getAlerts);
router.post("/", createAlert);
router.put("/:id/ack", acknowledgeAlert);

module.exports = router;
