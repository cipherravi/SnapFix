const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { JobApplicationService } = require("../services");

async function createJobApplication(req, res) {
  try {
    let { jobId } = req.params;
    let message;
    if (req.body !== undefined) {
      const userMessage = req.body.message;
      message = userMessage;
    }
    const userId = req.user.id;
    jobId = parseInt(jobId);

    const response = await JobApplicationService.createJobApplication({
      jobId,
      userId,
      message,
    });

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully created job Application";
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
        : "Something went wrong while creating job Application";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getAllJobApplicationsForJob(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const response = await JobApplicationService.getAllJobApplicationsForJob(
      jobId,
      userId
    );

    SuccessResponse.data = response;
    SuccessResponse.message = `Successfully Fetched All Job Applications for Job Id - ${jobId}`;
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
        : `Something went wrong while fetching All Job Applications for Job Id - ${jobId}`;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getAllJobApplications(req, res) {
  try {
    const response = await JobApplicationService.getAllJobApplications();

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Fetched All Job Applications";
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
        : "Something went wrong while fetching All Job Applications";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateJobApplication(req, res) {
  try {
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const userId = req.user.id;
    const { jobApplicationId } = req.params;
    const { status } = req.body;
    const response = await JobApplicationService.updateJob(
      userId,
      jobApplicationId,
      {
        status,
      }
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated Job Application Status";
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
        : "Something went wrong while updating Job Application Status";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function destroyJobApplication(req, res) {
  try {
    const userId = req.user.id;
    const { jobApplicationId } = req.params;
    const response = await JobApplicationService.destroyJobApplication(
      userId,
      jobApplicationId
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully destroyed Job Application";
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
        : "Something went wrong while destroying Job Application";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function startWorking(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const response = await JobApplicationService.startWorking(+userId, jobId);

    if (!response) {
      throw new AppError(
        "Failed to mark started working, try again",
        StatusCodes.BAD_REQUEST
      );
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully started Job";
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
        : "Something went wrong while starting job";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function markCompleted(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const response = await JobApplicationService.markCompleted(+userId, jobId);

    if (!response) {
      throw new AppError(
        "Failed to mark completed, try again",
        StatusCodes.BAD_REQUEST
      );
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully completed Job";
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
        : "Something went wrong while marking job completed";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function rejectApplication(req, res) {
  try {
    //api/v1/jobs/:jobId/reject
    const userId = req.user.id;
    const { jobId, jobApplicationId } = req.params;
    // const { jobApplicationId } = req.body;

    const response = await JobApplicationService.rejectApplication(
      +userId,
      jobId,
      jobApplicationId
    );

    if (!response) {
      throw new AppError(
        "Failed to reject application, try again",
        StatusCodes.BAD_REQUEST
      );
    }

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Rejected application";
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
        : "Something went wrong while rejecting application";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createJobApplication,
  getAllJobApplicationsForJob,
  getAllJobApplications,
  updateJobApplication,
  destroyJobApplication,
  startWorking,
  markCompleted,
  rejectApplication,
};
