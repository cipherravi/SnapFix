const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { PaymentService } = require("../services");

async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { amount, jobId, method } = req.body;

    const response = await PaymentService.createOrder(
      amount,
      jobId,
      userId,
      method
    );

    SuccessResponse.message = "Successfully created payment order";
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
    const userId = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      id,
      jobId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !id
    ) {
      throw new AppError(
        "Missing payment verification params",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await PaymentService.verifyPayment(
      id,
      userId,
      jobId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
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
      error instanceof AppError ? error.message : "Failed to verify payment";

    ErrorResponse.message = message;
    ErrorResponse.error = error;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createOrder, verifyPayment };
