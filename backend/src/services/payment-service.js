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
  // 1️⃣ Early Validation (COD Check & Amount Mismatch)
  if (method === COD) {
    const codActiveCount = await jobRepository.countMyCODActiveJobs(userId);
    if (codActiveCount > 0) {
      throw new AppError(
        "You can only post 1 job using COD.",
        StatusCodes.FORBIDDEN,
      );
    }
  }

  const actualAmount = await calculateJobCharges(jobId, method);
  if (actualAmount.total !== amount) {
    throw new AppError("Details Mismatch", StatusCodes.BAD_REQUEST);
  }

  // 2️⃣ Quick Peek: Read the DB early (No transaction/locks yet)
  // This allows us to see if we can short-circuit early
  const existingPayment = await paymentRepository.findPayment(jobId);

  if (existingPayment && existingPayment.method === method) {
    return existingPayment; // Clean return, zero external API calls made!
  }

  // 3️⃣ Safe Third-Party Call: Only triggered if we ACTUALLY need a new order
  let razorpayOrder = null;
  if (method === ONLINE) {
    try {
      razorpayOrder = await Razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `Job_${jobId}_payment`,
        notes: { reason: "Job creation" },
      });
    } catch (apiError) {
      logger.error("Razorpay order creation failed", { jobId, apiError });
      throw new AppError(
        "Payment gateway unavailable",
        StatusCodes.BAD_GATEWAY,
      );
    }
  }

  // 4️⃣ Write Transaction: Open the transaction ONLY for updates and insertions
  const transaction = await sequelize.transaction();
  try {
    // Re-verify the existing payment inside the transaction to prevent race conditions
    const strictExistingPayment = await paymentRepository.findPayment(jobId);

    // If someone somehow created a matching payment in the split-second
    // it took to call Razorpay, handle it gracefully
    if (strictExistingPayment && strictExistingPayment.method === method) {
      await transaction.commit();
      return strictExistingPayment;
    } else if (strictExistingPayment) {
      // Abandon the old method payment since the user is changing methods
      await paymentRepository.update(
        strictExistingPayment.id,
        { attemptStatus: ABANDONED },
        { transaction },
      );
    }

    let result;
    const amountInRs = amount / 100;

    // --- WALLET METHOD ---
    if (method === WALLET) {
      const wallet = await walletRepository.findWallet(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet)
        throw new AppError("Wallet not found", StatusCodes.NOT_FOUND);
      if (parseFloat(wallet.balance) < amountInRs) {
        throw new AppError(
          "Insufficient wallet balance.",
          StatusCodes.PAYMENT_REQUIRED,
        );
      }

      const currentBalance = parseFloat(wallet.balance);
      await walletRepository.decrementBalance(wallet.id, amountInRs, {
        transaction,
      });

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

      // --- ONLINE METHOD ---
    } else if (method === ONLINE) {
      result = await paymentRepository.create(
        {
          jobId,
          userId,
          amount: razorpayOrder.amount / 100,
          currency: razorpayOrder.currency,
          method,
          status: INITIATED,
          razorpayOrderId: razorpayOrder.id,
        },
        { transaction },
      );

      // --- COD METHOD ---
    } else if (method === COD) {
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
    logger.error("Create order transaction failed", { jobId, userId, error });
    if (error instanceof AppError) throw error;
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
