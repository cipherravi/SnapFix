const express = require("express");
const router = express.Router();

const {
  WalletController,
  WalletPaymentController,
} = require("../../controllers");

const { getBalance, withdrawMoney } = WalletController;
const { createOrder, verifyPayment } = WalletPaymentController;

const { verifyUser } = require("../../middlewares");

router.get("/balance", verifyUser, getBalance);

router.post("/add-money", verifyUser, createOrder);
router.post("/verify", verifyUser, verifyPayment);
router.post("/withdraw-money", verifyUser, withdrawMoney);

module.exports = router;
