const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");

async function verifyCreate(req, res, next) {
  try {
    const requiredFields = ["bankDetailId", "amount"];

    if (!req.body || typeof req.body !== "object") {
      throw new AppError(
        "Request body is missing or invalid",
        StatusCodes.BAD_REQUEST
      );
    }

    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong during validation";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function verifyUpdateStatus(req, res, next) {
  try {
    const requiredFields = ["status"];

    if (!req.body || typeof req.body !== "object") {
      throw new AppError(
        "Request body is missing or invalid",
        StatusCodes.BAD_REQUEST
      );
    }

    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong during validation";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function verifyPayment(req, res, next) {
  try {
    const requiredFields = ["utrId"];

    if (!req.body || typeof req.body !== "object") {
      throw new AppError(
        "Request body is missing or invalid",
        StatusCodes.BAD_REQUEST
      );
    }

    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong during validation";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { verifyCreate, verifyUpdateStatus, verifyPayment };
