const express = require("express");
const router = express.Router();

const {
  WalletController,
  WalletPaymentController,
} = require("../../controllers");

const { getBalance, withdrawMoney, getAllTransactions } = WalletController;
const { createOrder, verifyPayment, payDebt } = WalletPaymentController;

const { verifyUser } = require("../../middlewares");

router.get("/balance", verifyUser, getBalance);

router.post("/add-money", verifyUser, createOrder);
router.post("/verify", verifyUser, verifyPayment);
router.post("/withdraw-money", verifyUser, withdrawMoney);
router.post("/pay-debt", verifyUser, payDebt);

router.get("/transactions", verifyUser, getAllTransactions);

module.exports = router;
