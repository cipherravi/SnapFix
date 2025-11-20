const express = require("express");
const router = express.Router();
const { WithdrawRequestController } = require("../../controllers");
const { verifyAdmin, withdrawRequest } = require("../../middlewares");
const { verifyUpdateStatus, verifyPayment } = withdrawRequest;
const { updateWithdrawalstatus, payForWithdrawal } = WithdrawRequestController;

router.patch(
  "/withdrawals/:id/status",
  verifyAdmin,
  verifyUpdateStatus,
  updateWithdrawalstatus
);
router.patch(
  "/withdrawals/:id/payment",
  verifyAdmin,
  verifyPayment,
  payForWithdrawal
);

module.exports = router;
