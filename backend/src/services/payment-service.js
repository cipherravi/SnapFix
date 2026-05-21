const crypto = require("crypto");
const {
  JobRepository,
  PaymentRepository,
  WalletRepository,
  WalletTransactionRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const Razorpay = require("../config/razorpay-config");
const {
  calculateJobCharges,
  calculateJobChargesPreview,
} = require("./jobCharge-service");

const jobRepository = new JobRepository();
const paymentRepository = new PaymentRepository();
const walletRepository = new WalletRepository();
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
const { DEBIT } = TRANSACTION_TYPE;
const { JOB_PAYMENT } = WALLET_TRANSACTION_PURPOSE;

async function createOrder(amount, jobId, userId, method) {
  if (method === COD) {
    const codActiveCount = await jobRepository.countMyCODActiveJobs(userId);

    if (codActiveCount > 0) {
      throw new AppError(
        "You can only post 1 job using COD. Please choose another payment option.",
        StatusCodes.FORBIDDEN,
      );
    }
  }

  // 1️⃣ Validate and calculate first (no DB locks yet)
  const actualAmount = await calculateJobCharges(jobId, method);

  if (actualAmount.total !== amount) {
    throw new AppError("Details Mismatch", StatusCodes.BAD_REQUEST);
  }

  // 3️⃣ Now start DB transaction
  const transaction = await sequelize.transaction();
  try {
    let result;

    // 🔍 Check for existing active payment
    const existingPayment = await paymentRepository.findPayment(jobId);
    // ⏪ If existing active payment has same method then return otherwise ABAND that paymemt and create new
    if (existingPayment && existingPayment.method == method) {
      await transaction.commit();
      return existingPayment;
    } else if (existingPayment) {
      await paymentRepository.update(
        existingPayment.id,
        {
          attemptStatus: ABANDONED,
        },
        { transaction },
      );
    }

    // 🆕 Else, create new one
    if (method === WALLET) {
      const amountInRs = amount / 100;

      // deduct from wallet if balance available
      const wallet = await walletRepository.findWallet(userId);
      if (!wallet) {
        throw new AppError(
          "Payment failed, Unable to find your wallet",
          StatusCodes.NOT_FOUND,
        );
      }
      if (wallet.balance < amountInRs) {
        throw new AppError(
          `Insufficient wallet balance. Your current balance is ₹${wallet.balance}.`,
          StatusCodes.PAYMENT_REQUIRED,
        );
      }

      await walletRepository.decrementBalance(wallet.id, amountInRs, {
        transaction,
      });

      const currentBalance = parseFloat(wallet.balance);
      // create wallet txn
      const walletTransaction = await walletTransactionRepository.create(
        {
          walletId: wallet.id,
          transactionType: DEBIT,
          amount: amountInRs,
          status: SUCCESS,
          previousBalance: currentBalance,
          newBalance: currentBalance - amountInRs,
          reference: `JOB-${jobId}-CLIENT-DEBIT`,
          purpose: JOB_PAYMENT,
        },
        { transaction },
      );

      // create payment repository with success
      result = await paymentRepository.create(
        {
          jobId,
          userId,
          amount: amountInRs,
          method,
          status: SUCCESS,
          provider: "snapfix",
          txnReference: `wallet transaction - ${walletTransaction.id}`,
        },
        { transaction },
      );
      await jobRepository.update(jobId, { status: POSTED }, { transaction });
    } else if (method === ONLINE) {
      const order = await Razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `Job_${jobId}_payment`,
        notes: {
          reason: "Job creation",
        },
      });

      const amountInRs = order.amount / 100;
      //save to db
      result = await paymentRepository.create(
        {
          jobId,
          userId,
          amount: amountInRs,
          currency: order.currency,
          method,
          status: INITIATED,
          razorpayOrderId: order.id,
        },
        { transaction },
      );
    } else if (method === COD) {
      const amountInRs = amount / 100;

      result = await paymentRepository.create(
        {
          jobId,
          userId,
          amount: amountInRs,
          method,
          status: PENDING,
          provider: "snapfix",
        },
        { transaction },
      );
      await jobRepository.update(jobId, { status: POSTED }, { transaction });
    }
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    logger.error("Create order failed", { jobId, userId, error });
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
  userId,
  jobId,
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

    // Step 3: Update your DB (mark job as posted + save payment record)
    await paymentRepository.update(
      id,
      {
        userId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: SUCCESS,
      },
      { transaction },
    );

    await jobRepository.update(jobId, { status: POSTED }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    logger.info(`Payment verified for job ${jobId}, user ${userId}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to verify payment",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

module.exports = { createOrder, verifyPayment };
