const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { ChargeMasterService } = require("../services");

async function createCharge(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const {
      name,
      type,
      value,
      applicable_methods,
      apply_on,
      is_gross_up,
      priority,
    } = req.body;

    const response = await ChargeMasterService.createCharge({
      name,
      type,
      value,
      applicable_methods,
      apply_on,
      is_gross_up,
      priority,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created charge";
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
        : "Something went wrong while creating charge";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createCharge };
