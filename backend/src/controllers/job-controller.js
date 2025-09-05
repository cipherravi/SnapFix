const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { JobService, JobAssetService } = require("../services");
const { supabase } = require("../config");
const getFileType = require("../utils/helper/getFileType");

async function createJob(req, res) {
  try {
    if (req.body == undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const files = req.files;

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

    const job = await JobService.createJob({
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

    // ✅ Step 2: Upload each image to Supabase
    const uploads = [];
    for (const [docType, fileArr] of Object.entries(files)) {
      const file = fileArr[0];
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${userId}-${docType}.${fileExt}`;
      const filePath = `jobAssets/${fileName}`;

      const fileType = getFileType(file.mimetype);
      if (fileType === "unknown") {
        throw new AppError("Unsupported file type", StatusCodes.BAD_REQUEST);
      }

      const { error } = await supabase.storage
        .from("SnapFix")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      // ✅ Step 3: Save document row in DB
      const doc = await JobAssetService.createJobAsset({
        jobId: job.id,
        filePosition: docType.toLowerCase(),
        fileType,
        fileName: fileName,
      });

      uploads.push(doc);
    }

    SuccessResponse.data = job;
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
    const { title, description, budget, categoryId, cityId, addressId } =
      req.body;
    const response = await JobService.updateJob(userId, jobId, {
      title,
      description,
      budget,
      categoryId,
      cityId,
      addressId,
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
