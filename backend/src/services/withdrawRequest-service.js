const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const { LIMITS } = require("../utils/constants/");
const { MIN_WITHDRAW_AMOUNT } = LIMITS;
const { USER_ROLE, WITHDRAW_REQUEST_STATUS } = require("../utils/common/ENUM");
const { ADMIN, MODERATOR } = USER_ROLE;
const { PENDING, PROCESSING, PAID, REJECTED, CANCELLED } =
  WITHDRAW_REQUEST_STATUS;

const {
  WithdrawRequestRepository,
  WalletRepository,
  WorkerBankDetailRepository,
  UserRepository,
} = require("../repositories");
const { sequelize } = require("../models");

const withdrawRequestRepository = new WithdrawRequestRepository();
const walletRepository = new WalletRepository();
const workerBankDetailRepository = new WorkerBankDetailRepository();
const userRepository = new UserRepository();

// CREATE WITHDRAW REQUEST
async function createWithdrawal(data) {
  logger.info("Service: Create Withdrawal - START", { data });

  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Fetch Wallet
    logger.info("Fetching wallet for withdrawal", { userId: data.userId });

    const wallet = await walletRepository.findWallet(data.userId);

    if (!wallet) {
      logger.error("Wallet not found", { userId: data.userId });
      throw new AppError(
        "Failed to find wallet, try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // 2️⃣ Check balance
    if (wallet.balance < data.amount) {
      logger.warn("Insufficient wallet balance", {
        userId: data.userId,
        walletBalance: wallet.balance,
        withdrawAmount: data.amount,
      });

      throw new AppError(
        "Insufficient funds in wallet cannot withdraw",
        StatusCodes.BAD_REQUEST
      );
    }
    if (data.amount < MIN_WITHDRAW_AMOUNT) {
      logger.warn("Attempt to withdraw less than limit", {
        userId: data.userId,
        WITHDRAWAL_AMOUNT: data.amount,
        MIN_LIMIT: MIN_WITHDRAW_AMOUNT,
      });
      throw new AppError(
        `Cannot withdraw less than minimum limit ${MIN_WITHDRAW_AMOUNT}`,
        StatusCodes.BAD_REQUEST
      );
    }

    // 3️⃣ Fetch bank details
    logger.info("Fetching bank details for withdrawal", {
      bankDetailId: data.bankDetailId,
    });

    const bankdetails =
      await workerBankDetailRepository.fetchBankDetailOfWorkerById(
        data.bankDetailId
      );

    if (!bankdetails) {
      logger.error("Bank detail not found", {
        bankDetailId: data.bankDetailId,
      });

      throw new AppError(
        "Failed to fetch bank details, try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Ownership Check
    if (bankdetails.userId !== data.userId) {
      logger.warn("Unauthorized bank detail usage attempt", {
        requestUser: data.userId,
        bankDetailOwner: bankdetails.userId,
      });

      throw new AppError(
        "Account doesn't belong to you",
        StatusCodes.BAD_REQUEST
      );
    }

    // 4️⃣ Deduct wallet amount (WITH TRANSACTION)
    logger.info("Deducting wallet balance", {
      walletId: wallet.id,
      amount: data.amount,
    });

    await walletRepository.decrementBalance(wallet.id, data.amount, {
      transaction,
    });

    // 5️⃣ Create Withdrawal
    logger.info("Creating withdrawal record", { data });

    const withdrawal = await withdrawRequestRepository.create(data, {
      transaction,
    });

    // 6️⃣ COMMIT TRANSACTION
    await transaction.commit();

    logger.info("Withdrawal successfully created", {
      withdrawalId: withdrawal.id,
      userId: data.userId,
    });

    return withdrawal;
  } catch (error) {
    logger.error("Service Error: Withdrawal Failed", {
      error: error.message,
      stack: error.stack,
      data,
    });

    await transaction.rollback();

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to create withdrawal",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// FETCH ALL WITHDRAWALS
async function getWithdrawals(userId) {
  logger.info("Service: Get Withdrawals - START", { userId });

  try {
    const response =
      await withdrawRequestRepository.fetchAllWithdrawalsByUserId(userId);

    logger.info("Service: Get Withdrawals - SUCCESS", {
      userId,
      count: response.length,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Get Withdrawals Failed", {
      userId,
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to fetch withdrawals",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// FETCH ONE WITHDRAWAL
async function getWithdrawal(userId, id) {
  logger.info("Service: Get Withdrawal - START", {
    userId,
    withdrawalId: id,
  });

  try {
    const response = await withdrawRequestRepository.getById(id);

    if (!response) {
      logger.warn("Service: Withdrawal not found", {
        userId,
        withdrawalId: id,
      });

      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    if (response.userId !== userId) {
      logger.warn("Service: Unauthorized withdrawal access attempt", {
        requestUser: userId,
        owner: response.userId,
        withdrawalId: id,
      });

      throw new AppError("Failed to fetch withdrawal", StatusCodes.BAD_REQUEST);
    }

    logger.info("Service: Get Withdrawal - SUCCESS", {
      userId,
      withdrawalId: id,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Get Withdrawal Failed", {
      userId,
      withdrawalId: id,
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to fetch withdrawal",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// update
async function updateWithdrawalstatus(userId, id, status) {
  logger.info("Service: Update Withdrawal Status - START", {
    userId,
    withdrawalId: id,
    newStatus: status,
  });

  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Validate user role
    logger.info("Fetching admin/moderator user", { userId });

    const user = await userRepository.getByUserId(userId);

    if (user.role !== ADMIN && user.role !== MODERATOR) {
      logger.warn("Unauthorized withdrawal status update attempt", {
        userId,
        role: user.role,
      });

      throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    // 2️⃣ Fetch withdrawal
    logger.info("Fetching withdrawal for status update", { withdrawalId: id });

    const withdrawal = await withdrawRequestRepository.getById(id);

    if (!withdrawal) {
      logger.warn("Withdrawal not found", { withdrawalId: id });

      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    logger.info("Withdrawal fetched", {
      withdrawalId: id,
      currentStatus: withdrawal.status,
    });

    // 3️⃣ Validate status transitions
    let result;

    if (status === PENDING) {
      logger.warn("Invalid status transition: cannot set status to PENDING", {
        withdrawalId: id,
      });
      throw new AppError("Invalid status transition", StatusCodes.BAD_REQUEST);
    }

    if (status === PROCESSING) {
      if (withdrawal.status !== PENDING) {
        logger.warn("Invalid transition to PROCESSING", {
          withdrawalId: id,
          currentStatus: withdrawal.status,
        });
        throw new AppError(
          "Invalid status transition",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    if (status === PAID) {
      if (
        withdrawal.status !== PROCESSING ||
        !withdrawal.utrId ||
        !withdrawal.paidAt
      ) {
        logger.warn(
          "Invalid transition to PAID: either not PROCESSING or missing paid details",
          {
            withdrawalId: id,
            currentStatus: withdrawal.status,
            utrId: withdrawal.utrId,
            paidAt: withdrawal.paidAt,
          }
        );

        throw new AppError(
          "Cannot mark as PAID. Withdrawal must be in PROCESSING state and have paid details.",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    if (status === REJECTED) {
      if (withdrawal.status === PAID) {
        logger.warn("Invalid transition to REJECTED (already PAID)", {
          withdrawalId: id,
        });
        throw new AppError(
          "Invalid status transition",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    // 4️⃣ Update status
    logger.info("Updating withdrawal status", {
      withdrawalId: id,
      newStatus: status,
    });

    result = await withdrawRequestRepository.update(
      id,
      { status },
      { transaction }
    );

    // 5️⃣ Commit transaction
    await transaction.commit();

    logger.info("Service: Update Withdrawal Status - SUCCESS", {
      withdrawalId: id,
      newStatus: status,
    });

    return result;
  } catch (error) {
    logger.error("Service Error: Update Withdrawal Status Failed", {
      withdrawalId: id,
      newStatus: status,
      error: error.message,
      stack: error.stack,
    });

    await transaction.rollback();

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to update withdrawal status",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function payForWithdrawal(userId, id, utrId, remark) {
  logger.info("Service: Pay For Withdrawal - START", {
    requestedBy: userId,
    withdrawalId: id,
  });

  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Validate user role
    logger.info("Validating user role", { userId });

    const user = await userRepository.getByUserId(userId);
    logger.info("User fetched", { userId, role: user.role });

    if (user.role !== ADMIN && user.role !== MODERATOR) {
      logger.warn("Unauthorized withdrawal payment attempt", {
        userId,
        role: user.role,
        withdrawalId: id,
      });

      throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    // 2️⃣ Fetch withdrawal request
    logger.info("Fetching withdrawal record", { withdrawalId: id });

    const withdrawal = await withdrawRequestRepository.getById(id);

    if (!withdrawal) {
      logger.warn("Withdrawal record not found", { withdrawalId: id });
      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    logger.info("Withdrawal record fetched", {
      withdrawalId: id,
      currentStatus: withdrawal.status,
    });

    // 3️⃣ Validate status transitions before payment
    if (withdrawal.status === PAID) {
      logger.warn("Attempt to mark already PAID withdrawal again", {
        withdrawalId: id,
      });
      throw new AppError("Withdrawal already paid", StatusCodes.BAD_REQUEST);
    }

    if (withdrawal.status !== PROCESSING) {
      logger.warn("Payment attempted without PROCESSING status", {
        withdrawalId: id,
        currentStatus: withdrawal.status,
      });

      throw new AppError(
        "Cannot proceed — withdrawal is not in processing",
        StatusCodes.BAD_REQUEST
      );
    }

    // 4️⃣ Update payment info
    logger.info("Updating withdrawal with payment details", {
      withdrawalId: id,
      utrId,
      paidBy: userId,
    });

    const response = await withdrawRequestRepository.update(
      id,
      {
        paidAt: new Date(),
        utrId,
        paidBy: userId,
        remark,
        status: PAID,
      },
      { transaction }
    );

    // 5️⃣ Commit
    await transaction.commit();

    logger.info("Service: Withdrawal payment completed successfully", {
      withdrawalId: id,
      paidBy: userId,
    });

    return response;
  } catch (error) {
    await transaction.rollback();

    logger.error("Service Error: Withdrawal payment failed", {
      requestedBy: userId,
      withdrawalId: id,
      error: error.message,
      stack: error.stack,
    });
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        "Invalid data provided, UTR already exists",
        StatusCodes.BAD_REQUEST
      );
    }

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to update withdrawal status",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// delete

async function cancelWithdrawal(userId, id) {
  logger.info("Service: Cancel Withdrawal - START", {
    requestedBy: userId,
    withdrawalId: id,
  });

  try {
    // 1️⃣ Fetch the withdrawal request
    logger.info("Fetching withdrawal request", { withdrawalId: id });

    const withdrawal = await withdrawRequestRepository.getById(id);

    if (!withdrawal) {
      logger.warn("Withdrawal request not found", { withdrawalId: id });
      throw new AppError("Withdrawal request not found", StatusCodes.NOT_FOUND);
    }

    logger.info("Withdrawal fetched", {
      withdrawalId: id,
      currentStatus: withdrawal.status,
      owner: withdrawal.userId,
    });

    // 2️⃣ Validate user ownership
    if (withdrawal.userId !== userId) {
      logger.warn("Unauthorized cancellation attempt", {
        requestedBy: userId,
        owner: withdrawal.userId,
        withdrawalId: id,
      });
      throw new AppError(
        "Unauthorized for the withdrawal request",
        StatusCodes.UNAUTHORIZED
      );
    }

    // 3️⃣ Validate status
    if (withdrawal.status !== PENDING) {
      logger.warn("Cancellation attempt for non-pending withdrawal", {
        withdrawalId: id,
        currentStatus: withdrawal.status,
      });
      throw new AppError(
        "Withdrawal in processing cannot be cancelled",
        StatusCodes.BAD_REQUEST
      );
    }

    // 4️⃣ Update withdrawal status to CANCELLED
    logger.info("Updating withdrawal status to CANCELLED", {
      withdrawalId: id,
    });

    const response = await withdrawRequestRepository.update(id, {
      status: CANCELLED,
    });

    logger.info("Withdrawal cancelled successfully", {
      withdrawalId: id,
      cancelledBy: userId,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Failed to cancel withdrawal", {
      requestedBy: userId,
      withdrawalId: id,
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to cancel withdrawal",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createWithdrawal,
  getWithdrawals,
  getWithdrawal,
  updateWithdrawalstatus,
  payForWithdrawal,
  cancelWithdrawal,
};
