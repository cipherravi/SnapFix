const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { CityService } = require("../services");

async function createCity(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const { name, state, pincode, latitute, longitude } = req.body;

    if (!name || !state) {
      throw new AppError(
        "Provide Name and state of city",
        StatusCodes.BAD_REQUEST
      );
    }
    const response = await CityService.createCity({
      name,
      state,
      pincode,
      latitute,
      longitude,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created city";
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
        : "Something went wrong while creating city";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getCity(req, res) {
  try {
    const { cityId } = req.params;
    const response = await CityService.getCity(cityId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched city";
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
        : "Something went wrong while fetching city";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllCity(req, res) {
  try {
    const response = await CityService.getAllCity();

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Fetched All cities";
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
        : "Something went wrong while fetching All cities";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateCity(req, res) {
  try {
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const cityId = req.body.id;
    const { name, state, pincode, latitude, longitude } = req.body;
    const response = await CityService.updateCity(cityId, {
      name,
      state,
      pincode,
      latitude,
      longitude,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated city";
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
        : "Something went wrong while updating city";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function destroyCity(req, res) {
  try {
    const { cityId } = req.params;
    const response = await CityService.destroyCity(cityId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully destroyed city";
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
        : "Something went wrong while destroying city";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createCity, getCity, getAllCity, updateCity, destroyCity };
