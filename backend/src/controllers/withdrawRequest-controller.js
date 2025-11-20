const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { WithdrawRequestService } = require("../services");

// CREATE WITHDRAW REQUEST
async function createWithdrawal(req, res) {
  logger.info("Controller: Create Withdrawal - START", {
    userId: req.user.id,
    bankDetailId: req.body.bankDetailId,
    amount: req.body.amount,
  });

  try {
    const userId = req.user.id;
    const { bankDetailId, amount } = req.body;

    const response = await WithdrawRequestService.createWithdrawal({
      userId,
      bankDetailId,
      amount,
    });

    logger.info("Controller: Create Withdrawal - SUCCESS", {
      userId,
      withdrawalId: response.id,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created withdrawal";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Create Withdrawal Failed", {
      userId: req.user.id,
      error: error.message,
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
        : "Something went wrong while creating withdrawal";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// FETCH ALL WITHDRAWALS
async function getWithdrawals(req, res) {
  logger.info("Controller: Get Withdrawals - START", {
    userId: req.user.id,
  });

  try {
    const userId = req.user.id;
    const response = await WithdrawRequestService.getWithdrawals(userId);

    logger.info("Controller: Get Withdrawals - SUCCESS", {
      userId,
      count: response.length,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched all withdrawals";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Get Withdrawals Failed", {
      userId: req.user.id,
      error: error.message,
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
        : "Something went wrong while fetching withdrawals";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// FETCH ONE WITHDRAWAL
async function getWithdrawal(req, res) {
  logger.info("Controller: Get Withdrawal - START", {
    userId: req.user.id,
    withdrawalId: req.params.id,
  });

  try {
    const userId = req.user.id;
    const { id } = req.params;

    const response = await WithdrawRequestService.getWithdrawal(userId, id);

    logger.info("Controller: Get Withdrawal - SUCCESS", {
      userId,
      withdrawalId: id,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched withdrawal";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller Error: Get Withdrawal Failed", {
      userId: req.user.id,
      withdrawalId: req.params.id,
      error: error.message,
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
        : "Something went wrong while fetching withdrawal";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// update

async function updateWithdrawalstatus(req, res) {
  logger.info("Controller: updateWithdrawalStatus - START", {
    adminId: req.admin.id,
    withdrawalId: req.params.id,
    newStatus: req.body.status,
  });

  try {
    const userId = req.admin.id;
    const { status } = req.body;
    const { id } = req.params;

    const response = await WithdrawRequestService.updateWithdrawalstatus(
      userId,
      id,
      status
    );

    logger.info("Controller: updateWithdrawalStatus - SUCCESS", {
      withdrawalId: id,
      updatedStatus: status,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated withdrawal status";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller: updateWithdrawalStatus - ERROR", {
      withdrawalId: req.params.id,
      adminId: req.admin.id,
      error: error.message,
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
        : "Something went wrong while updating withdrawal status";

    return res.status(statusCode).json(ErrorResponse);
  }
}

async function payForWithdrawal(req, res) {
  logger.info("Controller: payForWithdrawal - START", {
    adminId: req.admin.id,
    withdrawalId: req.params.id,
    utrId: req.body.utrId,
  });

  try {
    const userId = req.admin.id;
    const { utrId, remark } = req.body;
    const { id } = req.params;

    const response = await WithdrawRequestService.payForWithdrawal(
      userId,
      id,

      utrId,
      remark
    );

    logger.info("Controller: payForWithdrawal - SUCCESS", {
      withdrawalId: id,
      utrId,
      paidBy: userId,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated withdrawal";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error("Controller: payForWithdrawal - ERROR", {
      withdrawalId: req.params.id,
      adminId: req.admin.id,
      error: error.message,
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
        : "Something went wrong while paying for withdrawal";

    return res.status(statusCode).json(ErrorResponse);
  }
}

// cancel
async function cancelWithdrawal(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const response = await WithdrawRequestService.cancelWithdrawal(userId, id);
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Cancelled Withdrawal Request";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    ErrorResponse.error = error;
    ErrorResponse.message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while cancelling withdrawal";

    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createWithdrawal,
  getWithdrawals,
  getWithdrawal,
  updateWithdrawalstatus,
  payForWithdrawal,
  cancelWithdrawal,
};
