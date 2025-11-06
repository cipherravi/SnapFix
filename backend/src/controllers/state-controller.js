const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { StateService } = require("../services");

async function createState(req, res) {
  try {
    const { name } = req.body;
    const response = await StateService.createState({ name });

    if (!response) {
      throw new AppError("Failed to create State", StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created State";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while creating State";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getAllStates(req, res) {
  try {
    const response = await StateService.getAllStates();
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched states";
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
        : "Something went wrong while fetching States";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllDistrictsOfState(req, res) {
  try {
    const { stateId } = req.params;
    const response = await StateService.getAllDistrictsOfState(stateId);
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched districts of State";
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
        : "Something went wrong while fetching districts of State";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateState(req, res) {
  try {
  } catch (error) {}
}
async function destroyState(req, res) {
  try {
  } catch (error) {}
}

module.exports = {
  createState,
  getAllStates,
  getAllDistrictsOfState,
  updateState,
  destroyState,
};
