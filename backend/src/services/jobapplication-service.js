const {
  JobApplicationRepository,
  JobRepository,
  UserRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { JOB_STATUS, JOB_APPLICATION_STATUS } = require("../utils/common/ENUM");
const { POSTED, ASSIGNED, STARTED, COMPLETED, CANCELLED } = JOB_STATUS;
const { REJECTED } = JOB_APPLICATION_STATUS;
const { sequelize } = require("../models");

const jobApplicationRepository = new JobApplicationRepository();
const jobRepository = new JobRepository();
const userRepository = new UserRepository();

const { USER_ROLE } = require("../utils/common/ENUM");
const { WORKER } = USER_ROLE;

async function createJobApplication(data) {
  try {
    const user = await userRepository.getByUserId(data.userId);

    if (user.role !== WORKER) {
      throw new AppError(
        "Only worker can apply for jobs, try doing KYC first",
        StatusCodes.BAD_REQUEST
      );
    }

    const job = await jobRepository.findByJobId(data.jobId);

    if (!job) {
      throw new AppError("Job not found", StatusCodes.BAD_REQUEST);
    }
    if (job.status !== POSTED) {
      throw new AppError(
        "This Job is not open for applications, try another",
        StatusCodes.BAD_REQUEST
      );
    }
    if (data.userId == job.userId) {
      throw new AppError("Cannot apply to own Job", StatusCodes.BAD_REQUEST);
    }

    const hasApplied = await jobApplicationRepository.findJobApplication(
      data.userId,
      data.jobId
    );
    if (hasApplied) {
      throw new AppError(
        "You have already applied to this job",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await jobApplicationRepository.create(data);

    if (!response) {
      throw new AppError(
        "Failed to create job Application",
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        "You have already applied to this job",
        StatusCodes.BAD_REQUEST
      );
    }

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create job Application",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllJobApplicationsForJob(jobId, userId) {
  try {
    const response = await jobApplicationRepository.findAllJobApplications(
      jobId
    );
    if (response.length === 0) {
      return response;
    }

    const jobPoster = await jobRepository.findByJobId(jobId);

    const isOwner = jobPoster?.userId === +userId;

    if (!isOwner) {
      throw new AppError(
        `Failed to fetch All job Applications bcz you are not Job Owner`,
        StatusCodes.BAD_REQUEST
      );
    }
    if (!response) {
      throw new AppError(
        `Failed to fetch All job Applications for Job Id - ${jobId}`,
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to fetch All job Applications for Job Id - ${jobId}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllJobApplications() {
  try {
    const response = await jobApplicationRepository.getAll();
    if (!response) {
      throw new AppError(
        "Failed to fetch All job Applications",
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All job Applications",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateJobApplication(userId, jobApplicationId, data) {
  try {
    const jobApplication = await jobApplicationRepository.getById(
      jobApplicationId
    );

    if (!jobApplication) {
      throw new AppError("Job Application not found");
    }

    if (userId !== jobApplication.id) {
      throw new AppError("User does not belong to job");
    }
    if (job.status !== POSTED) {
      throw new AppError("Job details cannot update now");
    }
    const response = await jobApplicationRepository.update(jobId, data);
    if (!response) {
      throw new AppError("Failed to update job", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update job",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function destroyJobApplication(userId, jobApplicationId) {
  try {
    const jobApplication = await jobApplicationRepository.getById(
      jobApplicationId
    );

    if (!jobApplication) {
      throw new AppError("Job Application not found");
    }
    if (userId !== jobApplication.userId) {
      throw new AppError("User does not belong to job Application");
    }

    const response = await jobApplicationRepository.destroy(jobApplicationId);
    if (!response) {
      throw new AppError(
        "Failed to destroy job Application",
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy job Application",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function startWorking(userId, jobId) {
  const transaction = await sequelize.transaction();

  try {
    const job = await jobRepository.findByJobId(jobId);

    if (userId !== job.workerId) {
      throw new AppError(
        "Failed to start job, You are not assigned to it",
        StatusCodes.BAD_REQUEST
      );
    }

    switch (job.status) {
      case POSTED:
        throw new AppError(
          "Failed to start, as Job is not assigned to anyone",
          StatusCodes.BAD_REQUEST
        );
      case ASSIGNED:
        // No additional logic needed here
        break;
      case STARTED:
        throw new AppError(
          "Failed to start, as Job is already in started state",
          StatusCodes.BAD_REQUEST
        );
      case COMPLETED:
        throw new AppError(
          "Failed to start, as Job is already in completed state",
          StatusCodes.BAD_REQUEST
        );
      case CANCELLED:
        throw new AppError(
          "Failed to start, as Job is already in cancelled state",
          StatusCodes.BAD_REQUEST
        );

      default:
        break;
    }

    const markStarted = await jobRepository.update(
      jobId,
      { status: STARTED },
      { transaction }
    );
    if (!markStarted) {
      throw new AppError(
        "Failed to mark started,try again",
        StatusCodes.BAD_REQUEST
      );
    }

    await transaction.commit();

    return markStarted;
  } catch (error) {
    await transaction.rollback();

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to mark started working, try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function markCompleted(userId, jobId) {
  const transaction = await sequelize.transaction();
  try {
    const job = await jobRepository.findByJobId(jobId);

    if (userId !== job.workerId) {
      throw new AppError(
        "Failed to complete job, You are not assigned to it",
        StatusCodes.BAD_REQUEST
      );
    }

    switch (job.status) {
      case POSTED:
        throw new AppError(
          "Failed to complete, as Job is not assigned to anyone",
          StatusCodes.BAD_REQUEST
        );
      case ASSIGNED:
        throw new AppError(
          "Failed to complete, as Job is not started yet",
          StatusCodes.BAD_REQUEST
        );

      case STARTED:
        // No additional logic needed here
        break;
      case COMPLETED:
        throw new AppError(
          "Failed to complete, as Job is already in completed state",
          StatusCodes.BAD_REQUEST
        );
      case CANCELLED:
        throw new AppError(
          "Failed to complete, as Job is already in cancelled state",
          StatusCodes.BAD_REQUEST
        );

      default:
        break;
    }

    const markCompleted = await jobRepository.update(
      jobId,
      {
        status: COMPLETED,
      },
      { transaction }
    );
    if (!markCompleted) {
      throw new AppError(
        "Failed to mark completed,try again",
        StatusCodes.BAD_REQUEST
      );
    }

    const jobApplication = await jobApplicationRepository.findJobApplication(
      userId,
      jobId
    );

    if (jobApplication[0] === 0) {
      throw new AppError("Job application not found", StatusCodes.NOT_FOUND);
    }
    await jobApplicationRepository.update(
      jobApplication.id,
      { status: COMPLETED },
      { transaction }
    );

    await transaction.commit();

    return markCompleted;
  } catch (error) {
    await transaction.rollback();

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while marking job completed",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function rejectApplication(userId, jobId, jobApplicationId) {
  try {
    const job = await jobRepository.findByJobId(jobId);
    if (!job) {
      throw new AppError(
        "Failed to reject application as job doesn't exists",
        StatusCodes.NOT_FOUND
      );
    }
    if (job.userId != userId) {
      throw new AppError(
        "Failed to reject application as you do not own this job",
        StatusCodes.BAD_REQUEST
      );
    }

    const jobApplication = await jobApplicationRepository.getById(
      jobApplicationId
    );

    if (jobApplication.status !== "applied") {
      throw new AppError(
        "Failed to reject application as worker is in working state",
        StatusCodes.BAD_REQUEST
      );
    }

    const markReject = await jobApplicationRepository.update(jobApplicationId, {
      status: REJECTED,
    });
    return markReject;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while rejecting application",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
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
