const express = require("express");
const router = express.Router();
const { PaymentController } = require("../../controllers");
const { verifyUser, verifyAdmin } = require("../../middlewares");
const { createOrder, verifyPayment } = PaymentController;

router.post("/initiate", verifyUser, createOrder);
router.post("/verify", verifyUser, verifyPayment);
// router.post("webhook")

module.exports = router;
