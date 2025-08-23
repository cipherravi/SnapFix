const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { JobService } = require("../services");

async function createJob(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const {
      title,
      description,
      budget,
      categoryId,
      cityId,
      addressId,
      lat,
      lng,
    } = req.body;
    const userId = req.user.id;
    const response = await JobService.createJob({
      title,
      description,
      budget,
      userId,
      categoryId,
      cityId,
      addressId,
      lat,
      lng,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created job";
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
        : "Something went wrong while creating job";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getJob(req, res) {
  try {
    const { jobId } = req.params;
    const response = await JobService.getJob(jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched job";
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
        : "Something went wrong while fetching job";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllJobs(req, res) {
  try {
    const response = await JobService.getAllJobs(req.query);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Fetched All jobs";
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
        : "Something went wrong while fetching All jobs";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateJob(req, res) {
  try {
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const userId = req.user.id;
    const { jobId } = req.params;
    const { title, description, budget, categoryId } = req.body;
    const response = await JobService.updateJob(userId, jobId, {
      title,
      description,
      budget,
      categoryId,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated job details";
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
        : "Something went wrong while updating job details";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function destroyJob(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const response = await JobService.destroyJob(userId, jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully destroyed job";
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
        : "Something went wrong while destroying job";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function accept(req, res) {
  try {
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const userId = req.user.id;

    const { jobId } = req.params;
    const { userId: workerId } = req.body;
    const response = await JobService.accept(userId, jobId, workerId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully assigned to worker";
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
        : "Something went wrong while assigning to worker";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function markApproved(req, res) {
  try {
    const userId = req.user.id;

    const { jobId } = req.params;
    const response = await JobService.markApproved(userId, jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully approved job completion";
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
        : "Something went wrong while approving to job completion";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function cancelJob(req, res) {
  try {
    const userId = req.user.id;

    const { jobId } = req.params;
    const response = await JobService.cancelJob(userId, jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully cancelled Job poster";
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
        : "Something went wrong while cancelling Job poster";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getMyTasks(req, res) {
  try {
    const userId = req.user.id;

    const response = await JobService.getMyTasks(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched your tasks";
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
        : "Something went wrong while fetching your tasks";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getMyJobs(req, res) {
  try {
    const userId = req.user.id;

    const response = await JobService.getMyJobs(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched your jobs";
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
        : "Something went wrong while fetching your jobs";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createJob,
  getJob,
  getAllJobs,
  updateJob,
  destroyJob,
  accept,
  markApproved,
  cancelJob,
  getMyTasks,
  getMyJobs,
};
