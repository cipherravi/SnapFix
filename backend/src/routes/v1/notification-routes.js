const express = require("express");
const router = express.Router();
const { NotificationController } = require("../../controllers");
const { savePushToken, sendNotification } = NotificationController;
const { verifyUser, verifyAdmin } = require("../../middlewares");

router.post("/send", verifyAdmin, sendNotification);

module.exports = router;
