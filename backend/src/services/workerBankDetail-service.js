const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { USER_ROLE } = require("../utils/common/ENUM");
const { WORKER } = USER_ROLE;

const {
  WorkerBankDetailRepository,
  UserRepository,
} = require("../repositories");

const workerBankDetailRepository = new WorkerBankDetailRepository();
const userRepository = new UserRepository();

// create bank details
async function createWokerBankDetail(data) {
  logger.info("Service: Create Worker Bank Detail - START", {
    userId: data.userId,
  });

  try {
    logger.info("Service: Fetching user for role validation", {
      userId: data.userId,
    });

    const user = await userRepository.getByUserId(data.userId);

    logger.info("Service: User fetched", {
      userId: user.id,
      role: user.role,
    });

    if (user.role !== WORKER) {
      logger.warn("Service: Unauthorized role for bank creation", {
        userId: data.userId,
        role: user.role,
      });

      throw new AppError(
        "Banking facility is only for workers",
        StatusCodes.FORBIDDEN
      );
    }

    logger.info("Service: Creating worker bank detail", {
      userId: data.userId,
    });

    const response = await workerBankDetailRepository.create(data);

    logger.info("Service: Worker bank detail created - SUCCESS", {
      bankDetailId: response.id,
      userId: data.userId,
    });

    return response;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.warn("Service: Duplicate bank account detected", {
        userId: data.userId,
      });

      throw new AppError(
        "This bank account is already registered.",
        StatusCodes.BAD_REQUEST
      );
    }

    logger.error("Service Error: Create Worker Bank Detail - FAILED", {
      userId: data.userId,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to create bank details",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// fetch all
async function getWorkerBankDetails(userId) {
  logger.info("Service: Fetch All Worker Bank Details - START", { userId });

  try {
    const response =
      await workerBankDetailRepository.fetchAllBankDetailsOfWorker(userId);

    logger.info("Service: Fetch All Worker Bank Details - SUCCESS", {
      userId,
      count: response.length,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Fetch All Worker Bank Details - FAILED", {
      userId,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to fetch bank details",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// fetch one
async function getWorkerBankDetail(userId, id) {
  logger.info("Service: Fetch Single Worker Bank Detail - START", {
    userId,
    bankDetailId: id,
  });

  try {
    const response =
      await workerBankDetailRepository.fetchBankDetailOfWorkerById(id);

    if (!response) {
      logger.warn("Service: Bank detail not found", {
        userId,
        bankDetailId: id,
      });

      throw new AppError(
        `Bank detail not found for id-${id}`,
        StatusCodes.NOT_FOUND
      );
    }

    logger.info("Service: Bank detail fetched", {
      bankDetailId: id,
      owner: response.userId,
    });

    if (response.userId !== userId) {
      logger.warn("Service: Unauthorized bank detail access", {
        requestUser: userId,
        owner: response.userId,
        bankDetailId: id,
      });

      throw new AppError(
        "Bank account doesn't belong to you",
        StatusCodes.UNAUTHORIZED
      );
    }

    logger.info("Service: Fetch Single Worker Bank Detail - SUCCESS", {
      userId,
      bankDetailId: id,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Fetch Single Worker Bank Detail - FAILED", {
      userId,
      bankDetailId: id,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      `Failed to fetch bank detail of id-${id}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// delete
async function deleteWorkerBankDetail(userId, id) {
  logger.info("Service: Delete Worker Bank Detail - START", {
    userId,
    bankDetailId: id,
  });

  try {
    const bankDetail = await workerBankDetailRepository.getById(id);

    if (!bankDetail) {
      logger.warn("Service: Delete failed - bank detail not found", {
        userId,
        bankDetailId: id,
      });

      throw new AppError(
        `Failed to find record for id-${id}`,
        StatusCodes.NOT_FOUND
      );
    }

    logger.info("Service: Bank detail fetched for deletion", {
      bankDetailId: id,
      owner: bankDetail.userId,
    });

    if (bankDetail.userId !== userId) {
      logger.warn("Service: Unauthorized delete attempt", {
        requestUser: userId,
        owner: bankDetail.userId,
        bankDetailId: id,
      });

      throw new AppError(
        "Bank account doesn't belong to you",
        StatusCodes.UNAUTHORIZED
      );
    }

    logger.info("Service: Deleting bank detail", {
      bankDetailId: id,
    });

    const response = await workerBankDetailRepository.markDeleteForBankAccount(
      id
    );

    logger.info("Service: Delete Worker Bank Detail - SUCCESS", {
      userId,
      bankDetailId: id,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Delete Worker Bank Detail - FAILED", {
      userId,
      bankDetailId: id,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      `Failed to delete bank detail of id-${id}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createWokerBankDetail,
  getWorkerBankDetails,
  getWorkerBankDetail,
  deleteWorkerBankDetail,
};
