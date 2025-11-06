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
const { WalletService } = require(".");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { POSTED } = JOB_STATUS;
const { CREDIT, DEBIT } = TRANSACTION_TYPE;
const { JOB_PAYMENT, ADD_BALANCE, ADJUSTMENT, PENALTY, REFUND, WITHDRAWAL } =
  WALLET_TRANSACTION_PURPOSE;

async function createOrder(amount, userId, purpose) {
  try {
    const wallet = await walletRepository.findWallet(userId);
    if (!wallet) {
      throw new AppError(
        "Something went wrong, could not find wallet",
        StatusCodes.NOT_FOUND
      );
    }

    const order = await Razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: purpose,
    });

    const currentBalance = parseFloat(wallet.balance);
    const amountInRs = order.amount / 100;

    //save to db
    const newPayment = await walletPaymentRepository.create({
      userId,
      walletId: wallet.id,
      amount: amountInRs,
      method: ONLINE,
      status: INITIATED,
      razorpay_order_id: order.id,
      purpose,
    });

    // create transaction

    await walletTransactionRepository.create({
      walletId: wallet.id,
      transaction_type: CREDIT,
      amount: amountInRs,
      status: INITIATED,
      previous_balance: currentBalance,
      new_balance: currentBalance + amountInRs,
      reference: order.id,
      purpose,
    });

    return newPayment;
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
  walletId,
  amount,
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

    await walletPaymentRepository.update(id, {
      razorpay_payment_id,
      razorpay_signature,
      status: SUCCESS,
    });

    // fetch txn with reference
    const transaction = await walletTransactionRepository.getByReference(
      razorpay_order_id
    );

    await walletTransactionRepository.update(transaction.id, {
      status: SUCCESS,
    });
    await walletRepository.incrementBalance(walletId, amount);
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
