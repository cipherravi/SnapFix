const express = require("express");
const router = express.Router();

const { WithdrawRequestController } = require("../../controllers");
const { createWithdrawal, getWithdrawals, getWithdrawal, cancelWithdrawal } =
  WithdrawRequestController;

const { verifyUser, withdrawRequest } = require("../../middlewares");
const { verifyCreate } = withdrawRequest;

router.post("/", verifyUser, verifyCreate, createWithdrawal);
router.get("/", verifyUser, getWithdrawals);
router.get("/:id", verifyUser, getWithdrawal);
router.patch("/:id", verifyUser, cancelWithdrawal);

module.exports = router;
