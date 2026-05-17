const crypto = require("crypto");
const {
  WalletRepository,
  WalletPaymentRepository,
  WalletTransactionRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const Razorpay = require("../config/razorpay-config");

const walletRepository = new WalletRepository();
const walletPaymentRepository = new WalletPaymentRepository();
const walletTransactionRepository = new WalletTransactionRepository();

const { serverConfig } = require("../config");
const { RAZORPAY_KEY_SECRET } = serverConfig;

const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  JOB_STATUS,
  ATTEMPT_STATUS,
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_PURPOSE,
} = require("../utils/common/ENUM");

const { sequelize } = require("../models");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { POSTED } = JOB_STATUS;
const { CREDIT, DEBIT } = TRANSACTION_TYPE;
const { JOB_PAYMENT, ADD_BALANCE, ADJUSTMENT, PENALTY, REFUND, WITHDRAWAL } =
  WALLET_TRANSACTION_PURPOSE;

async function createOrder(amount, userId, purpose) {
  const wallet = await walletRepository.findWallet(userId);
  if (!wallet) {
    throw new AppError(
      "Something went wrong, could not find wallet",
      StatusCodes.NOT_FOUND,
    );
  }

  const order = await Razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: purpose,
  });

  const transaction = await sequelize.transaction();
  try {
    const currentBalance = parseFloat(wallet.balance);
    const amountInRs = order.amount / 100;

    //save to db
    const newPayment = await walletPaymentRepository.create(
      {
        userId,
        walletId: wallet.id,
        amount: amountInRs,
        method: ONLINE,
        status: INITIATED,
        razorpay_order_id: order.id,
        purpose,
      },
      { transaction },
    );

    // create transaction

    await walletTransactionRepository.create(
      {
        walletId: wallet.id,
        transaction_type: CREDIT,
        amount: amountInRs,
        status: INITIATED,
        previous_balance: currentBalance,
        new_balance: currentBalance + amountInRs,
        reference: order.id,
        purpose,
      },
      { transaction },
    );

    await transaction.commit();
    return newPayment;
  } catch (error) {
    await transaction.rollback();
    logger.error("Create order failed for wallet", { userId, error });

    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Order",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function verifyPayment(
  id,
  walletId,
  amount,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
) {
  const transaction = await sequelize.transaction();
  try {
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      throw new AppError(
        "Payment verification failed",
        StatusCodes.BAD_REQUEST,
      );
    }

    await walletPaymentRepository.update(
      id,
      {
        razorpay_payment_id,
        razorpay_signature,
        status: SUCCESS,
      },
      { transaction },
    );

    // fetch txn with reference
    const walletTxn =
      await walletTransactionRepository.getByReference(razorpay_order_id);
    if (walletTxn.walletId !== walletId) {
      throw new AppError(
        "Wallet transaction mismatch",
        StatusCodes.BAD_REQUEST,
      );
    }
    await walletTransactionRepository.update(
      walletTxn.id,
      {
        status: SUCCESS,
      },
      { transaction },
    );
    await walletRepository.incrementBalance(walletId, amount, { transaction });
    await transaction.commit();
    logger.info(`Payment verified for wallet ${walletId}`);
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    logger.error(`Failed to verify payment for wallet ${walletId}`, { error });
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to verify payment",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function payDebt(userId, purpose) {
  const wallet = await walletRepository.findWallet(userId);
  if (!wallet) {
    throw new AppError(
      "Something went wrong, could not find wallet",
      StatusCodes.NOT_FOUND,
    );
  }
  if (wallet.balance > 0) {
    throw new AppError("No debt found", StatusCodes.BAD_REQUEST);
  }
  const debtAmount = Math.abs(wallet.balance);
  const order = await Razorpay.orders.create({
    amount: Math.round(debtAmount * 100),
    currency: "INR",
    receipt: purpose,
  });

  const transaction = await sequelize.transaction();
  try {
    const currentBalance = parseFloat(wallet.balance);
    const amountInRs = order.amount / 100;

    //save to db
    const newPayment = await walletPaymentRepository.create(
      {
        userId,
        walletId: wallet.id,
        amount: amountInRs,
        method: ONLINE,
        status: INITIATED,
        razorpay_order_id: order.id,
        purpose,
      },
      { transaction },
    );

    // create transaction

    await walletTransactionRepository.create(
      {
        walletId: wallet.id,
        transaction_type: CREDIT,
        amount: amountInRs,
        status: INITIATED,
        previous_balance: currentBalance,
        new_balance: currentBalance + amountInRs,
        reference: order.id,
        purpose,
      },
      { transaction },
    );

    await transaction.commit();
    return newPayment;
  } catch (error) {
    await transaction.rollback();

    logger.error(`Failed to pay debt of user - ${userId}`, { error });
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to pay debt", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { createOrder, verifyPayment, payDebt };
