const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { JobChargeService } = require("../services");
const { CHARGES_APPLICABLE } = require("../utils/common/ENUM");

const { ONLINE, COD } = CHARGES_APPLICABLE;

async function createJobCharges(req, res) {
  try {
    const { jobId } = req.params;

    if (req.body === undefined || req.body.paymentMethod === "") {
      req.body = {};
      req.body.paymentMethod = ONLINE;
    }
    console.log(req);
    const { paymentMethod } = req.body;

    if (![ONLINE, COD].includes(paymentMethod)) {
      throw new AppError(
        "Payment Method doesn't exist",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await JobChargeService.calculateJobCharges(
      jobId,
      paymentMethod
    );

    if (!response) {
      throw new AppError(
        "Failed to create job charges",
        StatusCodes.BAD_REQUEST
      );
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created job charges";
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
        : "Something went wrong while creating job charges";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getChargesForJob(req, res) {
  try {
    const { jobId } = req.params;
    const { paymentMethod } = req.query;

    if (![ONLINE, COD].includes(paymentMethod)) {
      throw new AppError(
        "Payment Method doesn't exist",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await JobChargeService.calculateJobChargesPreview(
      jobId,
      paymentMethod
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched job charges";
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
        : "Something went wrong while fetching job charges";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createJobCharges, getChargesForJob };
