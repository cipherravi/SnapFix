const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { AddressService } = require("../services");

async function createAddress(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const userId = req.user.id;
    const { building, street, area, state, district, city } = req.body;
    if (!building || !area || !state || !district || !city) {
      throw new AppError(
        "Missing fields please fill all necessary details",
        StatusCodes.BAD_REQUEST
      );
    }
    const response = await AddressService.createAddress({
      userId,
      building,
      street,
      area,
      state,
      district,
      city,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created Address";
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
        : "Something went wrong while creating address";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllAddresses(req, res) {
  try {
    const userId = req.user.id;
    const response = await AddressService.getAllAddresses(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched addresses";
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
        : "Something went wrong while fetching addresses";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAddress(req, res) {
  try {
    const { id } = req.params;
    const response = await AddressService.getAddress(id);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched address";
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
        : "Something went wrong while fetching address";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateAddress(req, res) {
  try {
    const userId = req.user.id;
    const AddressId = req.body.id;
    const { building, street, area } = req.body;

    const response = await AddressService.updateAddress(AddressId, {
      userId,
      building,
      street,
      area,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated address";
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
        : "Something went wrong while updating address";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function removeAddress(req, res) {
  try {
  } catch (error) {}
}

module.exports = {
  createAddress,
  getAllAddresses,
  getAddress,
  updateAddress,
  removeAddress,
};
