const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { ReviewService } = require("../services");
const { REVIEW } = require("../utils/constants");
const {
  CREATE_SUCCESS,
  CREATE_FAILURE,
  GET_JOB_REVIEWS_SUCCESS,
  GET_JOB_REVIEWS_FAILURE,
  GET_USER_REVIEWS_SUCCESS,
  GET_USER_REVIEWS_FAILURE,
} = REVIEW;

async function createReview(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Body missing", StatusCodes.BAD_REQUEST); // put this logic in middlewares
    }

    const { id: reviewerId, role } = req.user;

    const { jobId, rating, comment } = req.body;

    const response = await ReviewService.createReview(
      reviewerId,
      role,
      jobId,
      rating,
      comment,
    );

    if (!response) {
      throw new AppError(CREATE_FAILURE, StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = CREATE_SUCCESS;

    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : CREATE_FAILURE;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllJobReviews(req, res) {
  try {
    const { jobId } = req.params;
    const response = await ReviewService.getAllJobReviews(jobId);
    if (!response) {
      throw new AppError(GET_JOB_REVIEWS_FAILURE, StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = GET_JOB_REVIEWS_SUCCESS;

    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError ? error.message : GET_JOB_REVIEWS_FAILURE;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllUserReviews(req, res) {
  try {
    const { userId } = req.params;

    const response = await ReviewService.getAllUserReviews(userId);
    if (!response) {
      throw new AppError(GET_USER_REVIEWS_FAILURE, StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = GET_USER_REVIEWS_SUCCESS;

    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError ? error.message : GET_USER_REVIEWS_FAILURE;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { createReview, getAllJobReviews, getAllUserReviews };
