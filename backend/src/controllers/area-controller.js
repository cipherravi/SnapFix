const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { AreaService } = require("../services");

async function createArea(req, res) {
  try {
    const { name, cityId, latitude, longitude } = req.body;
    const response = await AreaService.createArea({
      name,
      cityId,
      latitude,
      longitude,
    });

    if (!response) {
      throw new AppError("Failed to create Area", StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created Area";
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
        : "Something went wrong while creating Area";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getAllAreas(req, res) {
  try {
    const response = await AreaService.getAllAreas();
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched Areas";
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
        : "Something went wrong while fetching Areas";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function updateArea(req, res) {
  try {
  } catch (error) {}
}
async function destroyArea(req, res) {
  try {
  } catch (error) {}
}

module.exports = {
  createArea,
  getAllAreas,
  updateArea,
  destroyArea,
};
