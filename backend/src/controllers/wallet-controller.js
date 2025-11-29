const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { WalletService } = require("../services");

async function getBalance(req, res) {
  try {
    const userId = req.user.id;

    const response = await WalletService.getBalance(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched wallet balance";
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to fetch  wallet balance";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function withdrawMoney(req, res) {
  try {
    const userId = req.user.id;
    if (req.body == undefined) {
      throw new AppError("Missing amount field", StatusCodes.BAD_REQUEST);
    }
    const { amount, purpose } = req.body;
    console.log(req.body);
    if (amount < 200) {
      throw new AppError(
        "Minimum  ₹200 withdrawal allowed",
        StatusCodes.BAD_REQUEST
      );
    }
    const response = await WalletService.withdrawMoney(userId, amount, purpose);

    SuccessResponse.data = response;
    SuccessResponse.message =
      "Withdrawal successfull amount will credit into payment method within 2 business days";
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to withdraw money from wallet";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getAllTransactions(req, res) {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const response = await WalletService.getAllTransactions(userId, filters);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched wallet transactions";
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to fetch  wallet balance";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { getBalance, withdrawMoney, getAllTransactions };
