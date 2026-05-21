const {
  JobRepository,
  JobApplicationRepository,
  AddressRepository,
  JobHistoryRepository,
  WalletTransactionRepository,
  PaymentRepository,
  WalletRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { ENUM } = require("../utils/common");
const {
  JOB_STATUS,
  JOB_APPLICATION_STATUS,
  USER_ROLE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_PURPOSE,
} = ENUM;
const {
  INITIATED,
  POSTED,
  ASSIGNED,
  STARTED,
  IN_PROGRESS,
  COMPLETED,
  APPROVED,
  CANCELLED,
} = JOB_STATUS;

const { SELECTED, REJECTED } = JOB_APPLICATION_STATUS;
const { WORKER } = USER_ROLE;
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { PENDING, SUCCESS } = PAYMENT_STATUS;
const { DEBIT, CREDIT } = TRANSACTION_TYPE;
const { COMMISION, JOB_PAYMENT } = WALLET_TRANSACTION_PURPOSE;

const { RATES } = require("../utils/constants");
const { JOB_COMMISSION_ON_COD, JOB_COMMISSION_ON_PAID } = RATES;

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const Conversation = require("../models/conversation");
const formatAddress = require("../utils/formatAddress");
const { getIO, userSockets } = require("../socket");

const jobRepository = new JobRepository();
const jobApplicationRepository = new JobApplicationRepository();
const addressRepository = new AddressRepository();
const jobHistoryRepository = new JobHistoryRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const paymentRepository = new PaymentRepository();
const walletRepository = new WalletRepository();

async function createJob(data) {
  try {
    const userAddress = await addressRepository.getById(data.addressId);

    if (!userAddress || Number(data.addressId) !== userAddress.id) {
      throw new AppError("Invalid address", StatusCodes.BAD_REQUEST);
    }

    const initialAddress = formatAddress(userAddress);
    const cityId = userAddress.cityId;

    const response = await jobRepository.create({
      ...data,
      cityId,
      initialAddress,
    });
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
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getJobForClient(userId, jobId) {
  try {
    const response = await jobRepository.getByjobId(jobId);

    if (!response) {
      throw new AppError("Failed to fetch job", StatusCodes.BAD_REQUEST);
    }

    if (response.userId !== Number(userId)) {
      throw new AppError(
        "Job doesn't belong to you, cannot fetch details",
        StatusCodes.UNAUTHORIZED,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch job",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getJobForWorker(userId, jobId) {
  try {
    const response = await jobRepository.getByjobIdForWorker(jobId);

    if (!response) {
      throw new AppError("Failed to fetch job", StatusCodes.BAD_REQUEST);
    }

    if (response.workerId !== Number(userId)) {
      throw new AppError(
        "Job doesn't belong to you, cannot fetch details",
        StatusCodes.UNAUTHORIZED,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch job",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getJobForPublic(jobId) {
  try {
    const response = await jobRepository.getByjobIdForPublic(jobId);
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
  offset = 0,
  limit = 10,
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
        now.getTime() - postedWithin * 60 * 60 * 1000,
      ); // hours to ms
      filter.createdAt = { [Op.gte]: cutoffDate };
    }

    const response = await jobRepository.getAllJobs(filter, sortBy, {
      offset,
      limit,
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All jobs",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
async function updateJob(userId, jobId, data) {
  try {
    const job = await jobRepository.getById(jobId);

    if (!job) {
      throw new AppError("Job not found", StatusCodes.NOT_FOUND);
    }

    if (userId !== job.userId) {
      throw new AppError(
        "User does not belong to job",
        StatusCodes.BAD_REQUEST,
      );
    }
    if (![POSTED, INITIATED].includes(job.status)) {
      throw new AppError(
        "Job details cannot change now",
        StatusCodes.BAD_REQUEST,
      );
    }

    const applicants =
      await jobApplicationRepository.findAllJobApplications(jobId);

    if (applicants.length > 0) {
      throw new Error("Failed to update Job details, Job contains applicants");
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
        StatusCodes.BAD_REQUEST,
      );
    }

    const jobApplication = await jobApplicationRepository.findJobApplication(
      workerId,
      jobId,
    );
    if (jobApplication[0] === 0) {
      throw new AppError(
        "Job application not found for this worker",
        StatusCodes.NOT_FOUND,
      );
    }

    await jobApplicationRepository.update(
      jobApplication.id,
      { status: SELECTED, selectedAt: new Date() },
      { transaction },
    );

    const assignToWorker = await jobRepository.update(
      job.id,
      { workerId, status: ASSIGNED },
      { transaction },
    );

    if (assignToWorker[0] === 0) {
      throw new AppError(
        "Failed to assign Job to worker, try again",
        StatusCodes.BAD_REQUEST,
      );
    }

    // Create conversation (if not exists) after assigning job

    let newConversation = null;
    const io = getIO();
    if (!io) {
      logger.error(
        "Soket.io not initialized and got called in job-service for accept handler",
      );
      console.error("Socket.io not initialized");
      return;
    }

    await transaction.commit();

    const conversationKey = `job_${jobId}_${[userId, workerId]
      .sort((a, b) => a - b)
      .join("_")}`;

    const existingConversation = await Conversation.findOne({
      conversationKey,
    });
    if (!existingConversation) {
      newConversation = await Conversation.create({
        jobId: +jobId,
        participants: [+userId, +workerId].sort((a, b) => a - b),
        conversationKey, // to avoid creating duplicate conversation
        // lastMessage is left empty by default
        // active is left empty by default it is true
      });

      const conversationRoom = `conv:${newConversation._id}`;

      // Join both online users to this conversation
      const usersToJoin = [+userId, +workerId];

      usersToJoin.forEach((uid) => {
        if (userSockets[uid]) {
          userSockets[uid].forEach((sock) => {
            sock.join(conversationRoom);
            console.log(`🔗 Joined user ${uid} to ${conversationRoom}`);
          });
        }
      });

      // Notify both users conversation is created
      const io = getIO();
      io.to(`user:${userId}`).emit("conversationCreated", newConversation);
      io.to(`user:${workerId}`).emit("conversationCreated", newConversation);
    }

    return assignToWorker;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to asssign Job to worker , try again",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function updateJobStatus(userId, jobId, newStatus, workerId = null) {
  const transaction = await sequelize.transaction();
  try {
    if (!Object.values(JOB_STATUS).includes(newStatus)) {
      throw new AppError("Invalid job status", StatusCodes.BAD_REQUEST);
    }
    const job = await jobRepository.findByJobId(jobId);
    if (!job) {
      throw new AppError("Job not found", StatusCodes.NOT_FOUND);
    }

    const isClient = job.userId === Number(userId);
    const isWorker = job.workerId === Number(userId);

    if (!isClient && !isWorker) {
      throw new AppError(
        "You are not authorized to change this job",
        StatusCodes.FORBIDDEN,
      );
    }

    const validTransitions = {
      [POSTED]: [ASSIGNED, CANCELLED],
      [ASSIGNED]: [STARTED],
      [STARTED]: [IN_PROGRESS],
      [IN_PROGRESS]: [COMPLETED],
      [COMPLETED]: [APPROVED],
    };
    const currentStatus = job.status;
    const allowedNext = validTransitions[currentStatus] || [];
    if (!allowedNext.includes(newStatus)) {
      throw new AppError(
        `Invalid transition: ${currentStatus} → ${newStatus}`,
        StatusCodes.BAD_REQUEST,
      );
    }
    const clientOnly = [ASSIGNED, APPROVED, CANCELLED];
    const workerOnly = [STARTED, IN_PROGRESS, COMPLETED];

    if (clientOnly.includes(newStatus) && !isClient) {
      throw new AppError(
        "Only client can perform this action",
        StatusCodes.FORBIDDEN,
      );
    }
    if (workerOnly.includes(newStatus) && !isWorker) {
      throw new AppError(
        "Only worker can perform this action",
        StatusCodes.FORBIDDEN,
      );
    }

    // 4️⃣ Handle special transitions
    if (newStatus === ASSIGNED) {
      // worker gets assigned
      if (job.workerId) {
        throw new AppError(
          "Worker already assigned to this job",
          StatusCodes.BAD_REQUEST,
        );
      }
      if (!workerId) {
        throw new AppError(
          "Worker ID is required for assignment",
          StatusCodes.BAD_REQUEST,
        );
      }

      // ensure valid job application exists
      const jobApplication = await jobApplicationRepository.findJobApplication(
        workerId,
        jobId,
      );
      if (!jobApplication) {
        throw new AppError("Job application not found", StatusCodes.NOT_FOUND);
      }
      await jobRepository.update(
        jobId,
        { workerId, status: newStatus },
        { transaction },
      );
      await jobApplicationRepository.update(
        jobApplication.id,
        { status: SELECTED },
        { transaction },
      );
    }

    if (newStatus === COMPLETED) {
      const payment = await paymentRepository.findPayment(jobId);

      if (payment.method === COD && payment.status === PENDING) {
        const wallet = await walletRepository.findWallet(userId);
        if (!wallet) {
          throw new AppError(
            "Couldn't find your wallet, try again",
            StatusCodes.NOT_FOUND,
          );
        }
        await paymentRepository.update(
          payment.id,
          { status: SUCCESS },
          { transaction },
        );
        const debitAmount = payment.amount - JOB_COMMISSION_ON_COD * job.budget;
        const currentBalance = Number(wallet.balance);
        const newBalance = currentBalance - debitAmount;
        await walletRepository.decrementBalance(wallet.id, debitAmount, {
          transaction,
        });
        await walletTransactionRepository.create(
          {
            walletId: wallet.id,
            transaction_type: DEBIT,
            amount: debitAmount,
            status: SUCCESS,
            previous_balance: currentBalance,
            new_balance: newBalance,
            purpose: COMMISION,
            reference: `SnapFix commision for job - ${jobId}`,
          },
          { transaction },
        );
      }

      // mark jobapplicaton to be completed
      const application = await jobApplicationRepository.findJobApplication(
        job.workerId,
        jobId,
      );
      await jobApplicationRepository.update(
        application.id,
        { completedAt: new Date(), status: COMPLETED },
        { transaction },
      );
    }

    if (newStatus === APPROVED) {
      const payment = await paymentRepository.findPayment(jobId);
      if (
        (payment.method === ONLINE || payment.method === WALLET) &&
        payment.status === SUCCESS
      ) {
        const reference = `JOB-${jobId}-WORKER-CREDIT`;

        // 🧩 Idempotency check
        const existingTxn =
          await walletTransactionRepository.getByReferenceWithFilters(
            `Payment for job - ${jobId}`,
            { status: SUCCESS, transaction_type: CREDIT },
          );

        if (existingTxn) {
          // 💡 Already paid, skip double-crediting
          logger.warn(`Job ${jobId} already credited to wallet, skipping.`);
        } else {
          const wallet = await walletRepository.findWallet(job.workerId);
          if (!wallet) {
            throw new AppError(
              "Couldn't find worker wallet, try again or raise help on customer support",
              StatusCodes.NOT_FOUND,
            );
          }

          const creditAmount = job.budget * (1 - JOB_COMMISSION_ON_PAID);
          const currentBalance = Number(wallet.balance);
          const newBalance = currentBalance + creditAmount;
          await walletRepository.incrementBalance(wallet.id, creditAmount, {
            transaction,
          });

          await walletTransactionRepository.create(
            {
              walletId: wallet.id,
              transaction_type: CREDIT,
              amount: creditAmount,
              status: SUCCESS,
              previous_balance: currentBalance,
              new_balance: newBalance,
              purpose: JOB_PAYMENT,
              reference,
            },
            { transaction },
          );
        }
      }

      await Conversation.updateMany({ jobId }, { active: false });
    }

    if (newStatus === CANCELLED) {
      if (job.workerId) {
        throw new AppError(
          "Cannot cancel job after worker assignment",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    // 5️⃣ Update job status
    if (newStatus !== ASSIGNED) {
      await jobRepository.update(jobId, { status: newStatus }, { transaction });
    }

    // 6️⃣ Record job history
    await jobHistoryRepository.create(
      {
        jobId,
        changedBy: userId,
        oldStatus: currentStatus,
        newStatus,
      },
      { transaction },
    );

    await transaction.commit();

    // Create conversation (if not exists) after assigning job
    if (newStatus === ASSIGNED) {
      const conversationKey = `job_${jobId}_${[job.userId, workerId]
        .sort((a, b) => a - b)
        .join("_")}`;

      const existingConversation = await Conversation.findOne({
        conversationKey,
      });
      if (!existingConversation) {
        await Conversation.create({
          jobId,
          participants: [job.userId, workerId].sort((a, b) => a - b),
          conversationKey,
        });
      }
    }

    return { message: `Job status updated to ${newStatus}` };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Job status update failed`, {
      jobId,
      userId,
      message: error.message,
      stack: error.stack,
    });
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update job status, try again",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

// NOT IN USE
async function markApproved(userId, jobId) {
  try {
    const job = await jobRepository.findByJobId(jobId);

    if (job.userId != userId) {
      throw new AppError(
        "Failed to Approve as you don't own this job",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (job.status !== COMPLETED) {
      throw new AppError(
        "Failed to Approve as job is not in completed state",
        StatusCodes.BAD_REQUEST,
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
        StatusCodes.BAD_REQUEST,
      );
    }

    if (job.status !== POSTED || job.workerId !== null) {
      throw new AppError(
        "Failed to Cancel Job poster, it is assigned for worker",
        StatusCodes.BAD_REQUEST,
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
      StatusCodes.INTERNAL_SERVER_ERROR,
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
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
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
