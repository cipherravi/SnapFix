const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { JobService, JobAssetService } = require("../services");
const { supabase } = require("../config");
const getFileType = require("../utils/helper/getFileType");

const { BUDGET_LIMIT } = require("../utils/common/ENUM");
const { LOW, HIGH } = BUDGET_LIMIT;

const TITLE_MIN_LENGTH = 5;
const TITLE_MAX_LENGTH = 100;
const VALID_TITLE_REGEX = /^[\p{L}\p{N} .,'-]+$/u; // Allows letters, numbers, and common punctuation
const HAS_LETTER_REGEX = /[a-zA-Z]/;
const REPEATED_SPECIALS_REGEX = /([!@#$%^&*(),.?":{}|<>~`_\-=+])\1{2,}/;

async function createJob(req, res) {
  try {
    if (!req.body) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const files = req.files;

    const {
      title,
      description,
      budget,
      categoryId,
      addressId,
      latitude,
      longitude,
    } = req.body;

    const sanitizedTitle = title?.trim();

    // 🚫 Missing or wrong type
    if (!sanitizedTitle || typeof sanitizedTitle !== "string") {
      throw new AppError("Title is required", StatusCodes.BAD_REQUEST);
    }

    // 🚫 Too short or too long
    if (
      sanitizedTitle.length < TITLE_MIN_LENGTH ||
      sanitizedTitle.length > TITLE_MAX_LENGTH
    ) {
      throw new AppError(
        `Title must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`,
        StatusCodes.BAD_REQUEST
      );
    }

    // 🚫 No letters at all (just numbers or symbols)
    if (!HAS_LETTER_REGEX.test(sanitizedTitle)) {
      throw new AppError(
        "Title must contain at least one letter",
        StatusCodes.BAD_REQUEST
      );
    }

    // 🚫 Only junk characters or emojis
    if (!VALID_TITLE_REGEX.test(sanitizedTitle)) {
      throw new AppError(
        "Title contains invalid characters",
        StatusCodes.BAD_REQUEST
      );
    }

    // 🚫 Repeated abuse characters like !!!!! or ------
    if (REPEATED_SPECIALS_REGEX.test(sanitizedTitle)) {
      throw new AppError(
        "Title contains excessive special characters",
        StatusCodes.BAD_REQUEST
      );
    }

    // ✅ Budget range
    if (!budget || isNaN(budget)) {
      throw new AppError(
        "Budget is required and must be a number",
        StatusCodes.BAD_REQUEST
      );
    }

    const numericBudget = Number(budget);

    if (numericBudget < LOW || numericBudget > HIGH) {
      throw new AppError(
        `Budget must be between ${LOW} and ${HIGH}`,
        StatusCodes.BAD_REQUEST
      );
    }
    const userId = req.user.id;

    const job = await JobService.createJob({
      userId,
      title: sanitizedTitle,
      description,
      budget: numericBudget,
      categoryId,
      addressId,
      latitude,
      longitude,
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

async function getJobForClient(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const response = await JobService.getJobForClient(userId, jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched job details";
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
        : "Something went wrong while fetching job details";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getJobForPublic(req, res) {
  try {
    const { jobId } = req.params;
    const response = await JobService.getJobForPublic(jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched job details";
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
        : "Something went wrong while fetching job details";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getJobForWorker(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const response = await JobService.getJobForWorker(userId, jobId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched job details";
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
        : "Something went wrong while fetching job details";
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
    console.log(req.body);
    if (req.body === undefined) {
      throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
    }
    const userId = req.user.id;
    const { jobId } = req.params;
    const { title, description, budget, latitude, longitude } = req.body;
    const response = await JobService.updateJob(userId, jobId, {
      title,
      description,
      budget,
      latitude,
      longitude,
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

async function updateJobStatus(req, res) {
  try {
    const userId = req.user.id;
    console.log(req.body);
    const { status, workerId } = req.body;
    const { jobId } = req.params;

    const response = await JobService.updateJobStatus(
      userId,
      jobId,
      status,
      workerId
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully updated Job status";
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
        : "Something went wrong while updating Job status";
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
  getJobForClient,
  getJobForPublic,
  getJobForWorker,
  getAllJobs,
  updateJob,
  destroyJob,
  accept,
  markApproved,
  updateJobStatus,
  cancelJob,
  getMyTasks,
  getMyJobs,
};
