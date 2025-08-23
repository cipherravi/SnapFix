const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { CategoryService } = require("../services");

async function createCategory(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const { name, description } = req.body;

    const response = await CategoryService.createCategory({
      name,
      description,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created category";
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
        : "Something went wrong while creating category";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const response = await CategoryService.getCategory(categoryId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched category";
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
        : "Something went wrong while fetching category";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllCategory(req, res) {
  try {
    const response = await CategoryService.getAllCategory();

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Fetched All categories";
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
        : "Something went wrong while fetching All categories";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateCategory(req, res) {
  try {
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const { categoryId, name, description } = req.body;
    const response = await CategoryService.updateCategory(categoryId, {
      name,
      description,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated category";
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
        : "Something went wrong while updating category";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function destroyCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const response = await CategoryService.destroyCategory(categoryId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully destroyed category";
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
        : "Something went wrong while destroying category";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  destroyCategory,
};
