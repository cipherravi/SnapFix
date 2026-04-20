const {
  WalletRepository,
  WalletTransactionRepository,
  UserRepository,
  WorkerBankDetailRepository,
  WithdrawRequestRepository,
  WalletLedgerRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const {
  JOB_STATUS,
  USER_ROLE,
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_STATUS,
} = require("../utils/common/ENUM");

const { sequelize } = require("../models");
const generateHash = require("../utils/helper/generateLedgerHash");

const { APPROVED } = JOB_STATUS;
const { WORKER } = USER_ROLE;
const { DEBIT } = TRANSACTION_TYPE;
const { INITIATED } = WALLET_TRANSACTION_STATUS;

const walletRepository = new WalletRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const userRepository = new UserRepository();
const workerBankDetailRepository = new WorkerBankDetailRepository();
const withdrawRequestRepository = new WithdrawRequestRepository();
const walletLedgerRepository = new WalletLedgerRepository();

async function createWallet(userId) {
  try {
    const wallet = await walletRepository.create({ userId });
    if (!wallet) {
      throw new AppError(
        `Failed to create wallet for user - ${userId}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    return true;
  } catch (error) {
    logger.error(
      `Something went wrong during creation of wallet for user- ${userId}`,
    );
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Something went wrong during creation of wallet`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getBalance(userId) {
  try {
    const wallet = await walletRepository.findWallet(userId);

    return wallet;
  } catch (error) {
    logger.error(`Failed to fetch wallet balance`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to credit money into wallet");
  }
}

async function withdrawMoney(userId, amount, purpose, bankAccountId) {
  const transaction = await sequelize.transaction();
  try {
    const user = await userRepository.getByUserId(userId);

    if (!user) {
      throw new AppError(
        "Something went wrong, try again",
        StatusCodes.NOT_FOUND,
      );
    }
    if (user.role !== WORKER) {
      throw new AppError(
        "Only worker can withdraw money",
        StatusCodes.BAD_REQUEST,
      );
    }

    //Lock wallet Row
    const wallet = await walletRepository.findWallet(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!wallet) {
      throw new AppError("Cannot fetch user wallet", StatusCodes.NOT_FOUND);
    }

    if (Number(wallet.balance) < Number(amount)) {
      throw new AppError(
        "Insufficient funds cannot withdraw",
        StatusCodes.BAD_REQUEST,
      );
    }

    const bankAccount =
      await workerBankDetailRepository.fetchBankDetailOfWorkerById(
        bankAccountId,
      );

    if (!bankAccount || bankAccount.userId !== userId) {
      throw new AppError(
        "Withdrawal account doesn't belong to you",
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Wallet transaction
    await walletTransactionRepository.create(
      {
        walletId: wallet.id,
        transaction_type: DEBIT,
        amount,
        status: INITIATED,
        previous_balance: wallet.balance,
        new_balance: Number(wallet.balance) - Number(amount),
        purpose,
      },
      { transaction },
    );

    // Update wallet balance
    await walletRepository.decrementBalance(wallet.id, amount, { transaction });

    // Withdraw Request
    const request = await withdrawRequestRepository.create(
      {
        userId,
        bankDetailId: bankAccountId,
        amount,
      },
      { transaction },
    );

    // Get last ledger entry (WITH LOCK)
    const lastEntry = await walletLedgerRepository.lastEntry(wallet.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const previous_hash = lastEntry ? lastEntry.current_hash : null;
    const sequence = lastEntry ? lastEntry.sequence + 1 : 1;

    const created_at = new Date();

    // Generate hash
    const current_hash = generateHash({
      userId,
      walletId: wallet.id,
      amount,
      transaction_type: DEBIT,
      reference_id: `withdraw_${request.id}`,
      created_at,
      previous_hash,
      sequence,
    });

    // Insert Ledger Entry
    await walletLedgerRepository.create(
      {
        userId,
        walletId: wallet.id,
        amount,
        transaction_type: DEBIT,
        reference_id: `withdraw_${request.id}`,
        previous_hash,
        current_hash,
        sequence,
        created_at,
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    logger.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        "Concurrent transaction detected, retry",
        StatusCodes.CONFLICT,
      );
    }

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to withdraw money from wallet",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getAllTransactions(userId, filters = {}) {
  try {
    const wallet = await walletRepository.findWallet(userId);

    if (!wallet) {
      throw new AppError("Wallet not found, try again", StatusCodes.NOT_FOUND);
    }

    const transactions =
      await walletTransactionRepository.getAllTransactionsByWalletId(
        wallet.id,
        filters,
      );
    return transactions;
  } catch (error) {
    logger.error(`Failed to fetch wallet transactions of user- ${userId}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch wallet transactions",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

module.exports = {
  createWallet,
  getBalance,
  withdrawMoney,
  getAllTransactions,
};
