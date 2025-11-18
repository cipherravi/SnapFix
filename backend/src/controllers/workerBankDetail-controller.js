const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { WorkerBankDetailService } = require("../services");

// create bank detail
async function createWokerBankDetail(req, res) {
  const userId = req.user.id;

  logger.info("Controller: Create Worker Bank Detail - START", {
    userId,
    endpoint: req.originalUrl,
    body: {
      accountHolder: req.body.accountHolder,
      accountNumber: "****" + req.body.accountNumber.slice(-4),
      bankName: req.body.bankName,
      ifsc: req.body.ifsc,
    },
  });

  try {
    const response = await WorkerBankDetailService.createWokerBankDetail({
      userId,
      ...req.body,
    });

    logger.info("Controller: Bank detail created successfully", {
      userId,
      bankDetailId: response?.id,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created bank details";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Create bank detail failed", {
      userId,
      message: error.message,
      stack: error.stack,
    });

    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    ErrorResponse.error = error;
    ErrorResponse.message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while creating bank details";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// fetch all bank details
async function getWorkerBankDetails(req, res) {
  const userId = req.user.id;

  logger.info("Controller: Fetch All Bank Details - START", {
    userId,
    endpoint: req.originalUrl,
  });

  try {
    const response = await WorkerBankDetailService.getWorkerBankDetails(userId);

    logger.info("Controller: Fetched all bank details", {
      userId,
      count: response.length,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched bank details";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Fetch all bank details failed", {
      userId,
      message: error.message,
      stack: error.stack,
    });

    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    ErrorResponse.error = error;
    ErrorResponse.message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching bank details";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// fetch single bank detail
async function getWorkerBankDetail(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  logger.info("Controller: Fetch Single Bank Detail - START", {
    userId,
    bankDetailId: id,
    endpoint: req.originalUrl,
  });

  try {
    const response = await WorkerBankDetailService.getWorkerBankDetail(
      userId,
      id
    );

    logger.info("Controller: Bank detail fetched", {
      userId,
      bankDetailId: id,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = `Successfully fetched bank detail for id - ${id}`;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Fetch single bank detail failed", {
      userId,
      bankDetailId: id,
      message: error.message,
      stack: error.stack,
    });

    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    ErrorResponse.error = error;
    ErrorResponse.message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching bank detail";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// delete bank detail
async function deleteWorkerBankDetail(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  logger.info("Controller: Delete Bank Detail - START", {
    userId,
    bankDetailId: id,
    endpoint: req.originalUrl,
  });

  try {
    const response = await WorkerBankDetailService.deleteWorkerBankDetail(
      userId,
      id
    );

    logger.info("Controller: Bank detail deleted", {
      userId,
      bankDetailId: id,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully deleted bank detail";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Delete bank detail failed", {
      userId,
      bankDetailId: id,
      message: error.message,
      stack: error.stack,
    });

    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    ErrorResponse.error = error;
    ErrorResponse.message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while deleting bank detail";

    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createWokerBankDetail,
  getWorkerBankDetails,
  getWorkerBankDetail,
  deleteWorkerBankDetail,
};
