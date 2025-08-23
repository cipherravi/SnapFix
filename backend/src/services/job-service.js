const { JobRepository, JobApplicationRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { ENUM } = require("../utils/common");
const { POSTED, ASSIGNED, APPROVED, COMPLETED, CANCELLED } = ENUM.JOB_STATUS;
const { SELECTED } = ENUM.JOB_APPLICATION_STATUS;
const { Op } = require("sequelize");
const { sequelize, Address } = require("../models");
const Conversation = require("../models/conversation");
const formatAddress = require("../utils/formatAddress");

const jobRepository = new JobRepository();
const jobApplicationRepository = new JobApplicationRepository();

async function createJob(data) {
  try {
    const getUserAddress = await Address.findByPk(data.addressId);

    if (!getUserAddress) {
      throw new AppError("Invalid addressId", StatusCodes.BAD_REQUEST);
    }

    const address = formatAddress(getUserAddress);

    const response = await jobRepository.create({ ...data, address });
    if (!response) {
      throw new AppError("Failed to create job", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create job",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getJob(jobId) {
  try {
    const response = await jobRepository.getByjobId(jobId);
    if (!response) {
      throw new AppError("Failed to fetch job", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch job",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllJobs({
  categoryId,
  cityId,
  budget,
  status = "posted",
  workerId = null,
  postedWithin,
  sort,
}) {
  try {
    const filter = {};
    const sortBy = [["createdAt", "DESC"]];
    filter.status = status;
    filter.workerId = workerId;

    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (cityId) {
      filter.cityId = cityId;
    }

    if (postedWithin) {
      const now = new Date();
      const cutoffDate = new Date(
        now.getTime() - postedWithin * 60 * 60 * 1000
      ); // hours to ms
      filter.createdAt = { [Op.gte]: cutoffDate };
    }

    const response = await jobRepository.getAllJobs(filter, sortBy);
    if (!response) {
      throw new AppError("Failed to fetch All jobs", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All jobs",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function updateJob(userId, jobId, data) {
  try {
    const job = await jobRepository.getById(jobId);

    if (!job) {
      throw new AppError("Job not found");
    }

    if (userId !== job.userId) {
      throw new AppError(
        "User does not belong to job",
        StatusCodes.BAD_REQUEST
      );
    }
    if (job.status !== POSTED) {
      throw new AppError("Job details cannot update now");
    }
    const response = await jobRepository.update(jobId, data);
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

// IS IT NECESSARY TO GIVE DESTROY ACCESS TO CLIENT ?? or just cancel

async function destroyJob(userId, jobId) {
  try {
    const job = await jobRepository.getById(jobId);

    if (!job) {
      throw new AppError("Job not found");
    }
    if (userId !== job.userId) {
      throw new AppError("User does not belong to job");
    }

    const response = await jobRepository.destroy(jobId);
    if (!response) {
      throw new AppError("Failed to destroy job", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy job",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function accept(userId, jobId, workerId) {
  const transaction = await sequelize.transaction();
  try {
    const job = await jobRepository.findByJobId(jobId);
    if (!job) {
      throw new AppError("Job do not exist", StatusCodes.NOT_FOUND);
    }

    if (job.userId !== +userId) {
      throw new AppError("Job doesn't belong to You", StatusCodes.BAD_REQUEST);
    }
    if (job.userId === +workerId) {
      throw new AppError("Cannot assign to yourself", StatusCodes.BAD_REQUEST);
    }

    if (job.workerId !== null) {
      throw new AppError(
        "Failed to assign Job, Worker already working",
        StatusCodes.BAD_REQUEST
      );
    }

    const assignToWorker = await jobRepository.update(
      job.id,
      { workerId, status: ASSIGNED },
      { transaction }
    );

    if (assignToWorker[0] === 0) {
      throw new AppError(
        "Failed to assign Job to worker, try again",
        StatusCodes.BAD_REQUEST
      );
    }

    const jobApplication = await jobApplicationRepository.findJobApplication(
      workerId,
      jobId
    );
    if (jobApplication[0] === 0) {
      throw new AppError(
        "Job application not found for this worker",
        StatusCodes.NOT_FOUND
      );
    }

    await jobApplicationRepository.update(
      jobApplication.id,
      { status: SELECTED },
      { transaction }
    );

    await transaction.commit();

    // Create conversation (if not exists) after assigning job

    const conversationKey = `job_${jobId}_${[userId, workerId]
      .sort((a, b) => a - b)
      .join("_")}`;

    const existingConversation = await Conversation.findOne({
      conversationKey,
    });
    if (!existingConversation) {
      await Conversation.create({
        jobId: +jobId,
        participants: [+userId, +workerId].sort((a, b) => a - b),
        conversationKey, // to avoid creating duplicate conversation
        // lastMessage is left empty by default
        // active is left empty by default it is true
      });
    }

    return assignToWorker;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to asssign Job to worker , try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function markApproved(userId, jobId) {
  try {
    const job = await jobRepository.findByJobId(jobId);

    if (job.userId != userId) {
      throw new AppError(
        "Failed to Approve as you don't own this job",
        StatusCodes.BAD_REQUEST
      );
    }

    if (job.status !== COMPLETED) {
      throw new AppError(
        "Failed to Approve as job is not in completed state",
        StatusCodes.BAD_REQUEST
      );
    }

    const Approved = await jobRepository.update(jobId, {
      status: APPROVED,
    });

    // set conversation active -> false
    await Conversation.updateOne({ jobId: jobId }, { $set: { active: false } });

    return Approved;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to asssign Job to worker , try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function cancelJob(userId, jobId) {
  try {
    // is job exists ??
    // is job belong to user ??
    // is job in posted state ??
    // is job don't have any worker ??
    // THEN CANCEL IT

    const job = await jobRepository.findByJobId(jobId);

    if (job.userId != userId) {
      throw new AppError(
        "Failed to cancel Job poster as you don't own this job",
        StatusCodes.BAD_REQUEST
      );
    }

    if (job.status !== POSTED || job.workerId !== null) {
      throw new AppError(
        "Failed to Cancel Job poster, it is assigned for worker",
        StatusCodes.BAD_REQUEST
      );
    }

    const updateStatus = await jobRepository.update(jobId, {
      status: CANCELLED,
    });
    return updateStatus;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to Cancel Job poster, try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getMyTasks(userId) {
  try {
    const tasks = await jobRepository.getMyTasks(userId);

    return tasks;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to Fetch your tasks, try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getMyJobs(userId) {
  try {
    const jobs = await jobRepository.getMyJobs(userId);

    return jobs;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to Fetch your jobs, try again",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
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
