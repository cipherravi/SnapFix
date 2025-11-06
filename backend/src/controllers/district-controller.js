const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { DistrictService } = require("../services");

async function createDistrict(req, res) {
  try {
    const { name, stateId } = req.body;
    const response = await DistrictService.createDistrict({ name, stateId });

    if (!response) {
      throw new AppError("Failed to create District", StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created District";
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
        : "Something went wrong while creating District";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllDistricts(req, res) {
  try {
    const response = await DistrictService.getAllDistricts();
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched Districts";
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
        : "Something went wrong while fetching Districts";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getAllCitiesOfDistrict(req, res) {
  try {
    const { districtId } = req.params;
    const response = await DistrictService.getAllCitiesOfDistrict(districtId);
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched cities for District";
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
        : "Something went wrong while fetching cities for District";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateDistrict(req, res) {
  try {
  } catch (error) {}
}
async function destroyDistrict(req, res) {
  try {
  } catch (error) {}
}

module.exports = {
  createDistrict,
  getAllDistricts,
  getAllCitiesOfDistrict,
  updateDistrict,
  destroyDistrict,
};
