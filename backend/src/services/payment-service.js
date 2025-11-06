const crypto = require("crypto");
const { JobRepository, PaymentRepository } = require("../repositories");
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
const { serverConfig } = require("../config");
const { RAZORPAY_KEY_SECRET } = serverConfig;

const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  JOB_STATUS,
  ATTEMPT_STATUS,
} = require("../utils/common/ENUM");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { POSTED } = JOB_STATUS;

async function createOrder(amount, jobId, userId, method) {
  try {
    // verify amount
    const actualAmount = await calculateJobCharges(jobId, method);

    if (actualAmount.total !== amount) {
      throw new AppError("Details Mismatch", StatusCodes.BAD_REQUEST);
    }

    // 🔍 1. Check for existing active payment
    const existingPayment = await paymentRepository.findPayment(jobId, userId);

    // ⏪ 2. If existing active payment has same method then return otherwise ABAND that paymemt and create new
    if (existingPayment && existingPayment.method == method) {
      return existingPayment;
    } else if (existingPayment) {
      await paymentRepository.update(existingPayment.id, {
        attempt_status: ABANDONED,
      });
    }

    // 🆕 3. Else, create new one
    if (method === ONLINE) {
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
      const newPayment = await paymentRepository.create({
        jobId,
        userId,
        amount: amountInRs,
        currency: order.currency,
        method,
        status: INITIATED,
        razorpay_order_id: order.id,
      });

      return newPayment;
    } else if (method === COD) {
      const amountInRs = amount / 100;

      const newPayment = await paymentRepository.create({
        jobId,
        userId,
        amount: amountInRs,
        method,
        status: PENDING,
        provider: "snapfix",
      });
      await jobRepository.update(jobId, { status: POSTED });

      return newPayment;
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Order",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function verifyPayment(
  id,
  userId,
  jobId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) {
  try {
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      throw new AppError(
        "Payment verification failed",
        StatusCodes.BAD_REQUEST
      );
    }

    // Step 3: Update your DB (mark job as posted + save payment record)
    await paymentRepository.update(id, {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: SUCCESS,
    });

    await jobRepository.update(jobId, { status: POSTED });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to verify payment",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createOrder, verifyPayment };
