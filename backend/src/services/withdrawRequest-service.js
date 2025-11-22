const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

// CONSTANTS
const { LIMITS } = require("../utils/constants/");
const { MIN_WITHDRAW_AMOUNT } = LIMITS;

const {
  USER_ROLE,
  WITHDRAW_REQUEST_STATUS,
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_STATUS,
  WALLET_PAYMENT_PURPOSE,
} = require("../utils/common/ENUM");

const { ADMIN, MODERATOR } = USER_ROLE;
const { PENDING, PROCESSING, PAID, REJECTED, CANCELLED } =
  WITHDRAW_REQUEST_STATUS;

const { CREDIT, DEBIT } = TRANSACTION_TYPE;
const { WITHDRAWAL } = WALLET_PAYMENT_PURPOSE;

const { INITIATED, SUCCESS, FAILED } = WALLET_TRANSACTION_STATUS;

// REPOSITORIES
const {
  WithdrawRequestRepository,
  WalletRepository,
  WorkerBankDetailRepository,
  UserRepository,
  WalletTransactionRepository,
} = require("../repositories");

const { sequelize } = require("../models");

const withdrawRequestRepository = new WithdrawRequestRepository();
const walletRepository = new WalletRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const workerBankDetailRepository = new WorkerBankDetailRepository();
const userRepository = new UserRepository();

/* ============================================================
   CREATE WITHDRAWAL
============================================================ */
async function createWithdrawal(data) {
  logger.info("Service: Create Withdrawal - START", { data });

  const transaction = await sequelize.transaction();

  try {
    /** 1️⃣ Fetch Wallet */
    logger.info("Fetching wallet for withdrawal", { userId: data.userId });

    const wallet = await walletRepository.findWallet(data.userId);

    if (!wallet) {
      logger.error("Wallet not found", { userId: data.userId });
      throw new AppError(
        "Failed to find wallet, try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    /** 2️⃣ Check wallet balance */
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

    /** 3️⃣ Fetch bank details */
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

    // Ownership check
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

    /** 4️⃣ Deduct wallet balance */
    logger.info("Deducting wallet balance", {
      walletId: wallet.id,
      amount: data.amount,
    });

    await walletRepository.decrementBalance(wallet.id, data.amount, {
      transaction,
    });

    /** 5️⃣ Create withdrawal */
    logger.info("Creating withdrawal record", { data });

    const withdrawal = await withdrawRequestRepository.create(data, {
      transaction,
    });

    /** 6️⃣ Create wallet transaction log */
    await walletTransactionRepository.create(
      {
        walletId: wallet.id,
        transaction_type: DEBIT,
        amount: data.amount,
        status: INITIATED,
        previous_balance: wallet.balance,
        new_balance: wallet.balance - data.amount,
        purpose: WITHDRAWAL,
        reference: `Withdrawal to bank Account - ****${bankdetails.accountNumber.slice(
          -4
        )} - Request ${withdrawal.id}`,
      },
      { transaction }
    );

    /** 7️⃣ Commit */
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

/* ============================================================
   GET ALL WITHDRAWALS
============================================================ */
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

/* ============================================================
   GET ONE WITHDRAWAL
============================================================ */
async function getWithdrawal(userId, id) {
  logger.info("Service: Get Withdrawal - START", {
    userId,
    withdrawalId: id,
  });

  try {
    const response = await withdrawRequestRepository.getById(id);

    if (!response) {
      logger.warn("Withdrawal not found", { userId, withdrawalId: id });
      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    if (response.userId !== userId) {
      logger.warn("Unauthorized withdrawal access attempt", {
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

/* ============================================================
   UPDATE WITHDRAWAL STATUS (ADMIN/MODERATOR)
============================================================ */
async function updateWithdrawalstatus(userId, id, status) {
  logger.info("Service: Update Withdrawal Status - START", {
    userId,
    withdrawalId: id,
    newStatus: status,
  });

  const transaction = await sequelize.transaction();

  try {
    /** 1️⃣ Validate user role */
    logger.info("Fetching admin/moderator user", { userId });

    const user = await userRepository.getByUserId(userId);

    if (user.role !== ADMIN && user.role !== MODERATOR) {
      logger.warn("Unauthorized status update attempt", {
        userId,
        role: user.role,
      });

      throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    /** 2️⃣ Fetch withdrawal */
    logger.info("Fetching withdrawal for status update", { withdrawalId: id });

    const withdrawal =
      await withdrawRequestRepository.fetchWithdrawalWithBankDetailById(id);

    if (!withdrawal) {
      logger.warn("Withdrawal not found", { withdrawalId: id });

      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    logger.info("Withdrawal fetched", {
      withdrawalId: id,
      currentStatus: withdrawal.status,
    });

    /** 3️⃣ Validate status transitions */
    if (status === PENDING) {
      throw new AppError("Invalid status transition", StatusCodes.BAD_REQUEST);
    }

    if (status === PROCESSING && withdrawal.status !== PENDING) {
      throw new AppError("Invalid status transition", StatusCodes.BAD_REQUEST);
    }

    if (status === PAID) {
      if (
        withdrawal.status !== PROCESSING ||
        !withdrawal.utrId ||
        !withdrawal.paidAt
      ) {
        throw new AppError(
          "Cannot mark as PAID — must be PROCESSING + have paid details",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    if (status === REJECTED && withdrawal.status === PAID) {
      throw new AppError("Invalid status transition", StatusCodes.BAD_REQUEST);
    }

    /** 4️⃣ Update status */
    logger.info("Updating withdrawal status", {
      withdrawalId: id,
      newStatus: status,
    });

    const result = await withdrawRequestRepository.update(
      id,
      { status },
      { transaction }
    );

    const reference = `Withdrawal to bank Account - ****${withdrawal.bankDetail.accountNumber.slice(
      -4
    )} - Request ${withdrawal.id}`;

    const walletTransaction = await walletTransactionRepository.getByReference(
      reference
    );

    // Update wallet transaction log
    if (status === PROCESSING) {
      await walletTransactionRepository.update(
        walletTransaction.id,
        { status: PENDING },
        { transaction }
      );
    }

    if (status === PAID) {
      await walletTransactionRepository.update(
        walletTransaction.id,
        { status: SUCCESS },
        { transaction }
      );
    }

    if (status === REJECTED) {
      logger.info(`Withdrawal failed and amount refunding - START `, {
        userId: withdrawal.userId,
        withdrawalId: withdrawal.id,
        rejectedBy: userId,
      });
      await walletTransactionRepository.update(
        walletTransaction.id,
        { status: FAILED },
        { transaction }
      );

      // Refund wallet
      await walletRepository.incrementBalance(
        walletTransaction.walletId,
        walletTransaction.amount,
        { transaction }
      );
      logger.info(`Withdrawal failed and amount refunding - SUCCESS `, {
        userId: withdrawal.userId,
        withdrawalId: withdrawal.id,
        rejectedBy: userId,
      });
    }

    /** 5️⃣ Commit */
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

/* ============================================================
   PAY FOR WITHDRAWAL (ADMIN/MODERATOR)
============================================================ */
async function payForWithdrawal(userId, id, utrId, remark) {
  logger.info("Service: Pay For Withdrawal - START", {
    requestedBy: userId,
    withdrawalId: id,
  });

  const transaction = await sequelize.transaction();

  try {
    /** 1️⃣ Validate role */
    const user = await userRepository.getByUserId(userId);

    if (user.role !== ADMIN && user.role !== MODERATOR) {
      throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    /** 2️⃣ Fetch withdrawal */
    const withdrawal =
      await withdrawRequestRepository.fetchWithdrawalWithBankDetailById(id);

    if (!withdrawal) {
      throw new AppError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    /** 3️⃣ Validate transition */
    if (withdrawal.status === PAID) {
      throw new AppError("Withdrawal already paid", StatusCodes.BAD_REQUEST);
    }

    if (withdrawal.status !== PROCESSING) {
      throw new AppError(
        "Cannot proceed — withdrawal is not in processing",
        StatusCodes.BAD_REQUEST
      );
    }

    /** 4️⃣ Update */
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

    // Wallet transaction update
    const reference = `Withdrawal to bank Account - ****${withdrawal.bankDetail.accountNumber.slice(
      -4
    )} - Request ${withdrawal.id}`;

    const walletTransaction = await walletTransactionRepository.getByReference(
      reference
    );

    await walletTransactionRepository.update(
      walletTransaction.id,
      { status: SUCCESS },
      { transaction }
    );

    /** 5️⃣ Commit */
    await transaction.commit();

    logger.info("Service: Withdrawal payment completed successfully", {
      withdrawalId: id,
      paidBy: userId,
    });

    return response;
  } catch (error) {
    logger.error("Service Error: Withdrawal payment failed", {
      requestedBy: userId,
      withdrawalId: id,
      error: error.message,
      stack: error.stack,
    });

    await transaction.rollback();

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

/* ============================================================
   CANCEL WITHDRAWAL (USER)
============================================================ */
async function cancelWithdrawal(userId, id) {
  logger.info("Service: Cancel Withdrawal - START", {
    requestedBy: userId,
    withdrawalId: id,
  });

  const transaction = await sequelize.transaction();

  try {
    /** 1️⃣ Fetch withdrawal */
    const withdrawal =
      await withdrawRequestRepository.fetchWithdrawalWithBankDetailById(id);

    if (!withdrawal) {
      throw new AppError("Withdrawal request not found", StatusCodes.NOT_FOUND);
    }

    /** 2️⃣ Ownership validation */
    if (withdrawal.userId !== userId) {
      throw new AppError(
        "Unauthorized for the withdrawal request",
        StatusCodes.UNAUTHORIZED
      );
    }

    /** 3️⃣ Only PENDING withdrawals can be canceled */
    if (withdrawal.status !== PENDING) {
      throw new AppError(
        "Withdrawal in processing cannot be cancelled",
        StatusCodes.BAD_REQUEST
      );
    }

    /** 4️⃣ Cancel withdrawal */
    const response = await withdrawRequestRepository.update(
      id,
      { status: CANCELLED },
      { transaction }
    );

    /** 5️⃣ Update wallet transaction */
    const reference = `Withdrawal to bank Account - ****${withdrawal.bankDetail.accountNumber.slice(
      -4
    )} - Request ${withdrawal.id}`;

    const walletTransaction = await walletTransactionRepository.getByReference(
      reference
    );
    logger.info(`Withdrawal cancelled by user and amount refunding - START `, {
      userId,
      withdrawalId: withdrawal.id,
    });
    await walletTransactionRepository.update(
      walletTransaction.id,
      { status: FAILED },
      { transaction }
    );

    /** 6️⃣ Refund */
    await walletRepository.incrementBalance(
      walletTransaction.walletId,
      walletTransaction.amount,
      { transaction }
    );
    logger.info(
      `Withdrawal cancelled by user and amount refunding - SUCCESS `,
      {
        userId,
        withdrawalId: withdrawal.id,
      }
    );

    await transaction.commit();

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

    await transaction.rollback();

    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to cancel withdrawal",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/* ============================================================
   EXPORTS
============================================================ */
module.exports = {
  createWithdrawal,
  getWithdrawals,
  getWithdrawal,
  updateWithdrawalstatus,
  payForWithdrawal,
  cancelWithdrawal,
};
