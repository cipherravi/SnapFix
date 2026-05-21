const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { WalletPaymentService } = require("../services");

async function createOrder(req, res) {
  try {
    const userId = req.user.id;

    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const { amount, purpose } = req.body;
    if (amount < 100) {
      throw new AppError("Minimum ₹100 allowed", StatusCodes.BAD_REQUEST);
    }

    const response = await WalletPaymentService.createOrder(
      amount,
      userId,
      purpose,
    );

    SuccessResponse.message = "Successfully created wallet payment order";
    SuccessResponse.data = response;
    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to create payment order";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      walletId,
      razorpay_payment_id,
      razorpay_signature,
      id,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !id ||
      !amount ||
      !walletId
    ) {
      throw new AppError(
        "Missing payment verification params",
        StatusCodes.BAD_REQUEST,
      );
    }

    const response = await WalletPaymentService.verifyPayment(
      id,
      walletId,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Payment verified successfully";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to verify wallet payment";

    ErrorResponse.message = message;
    ErrorResponse.error = error;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function payDebt(req, res) {
  try {
    const userId = req.user.id;

    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const { purpose } = req.body;
    const response = await WalletPaymentService.payDebt(userId, purpose);
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully paid debt amount";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError ? error.message : "Failed to pay debt amount";

    ErrorResponse.message = message;
    ErrorResponse.error = error;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createOrder, verifyPayment, payDebt };
