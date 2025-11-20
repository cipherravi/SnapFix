const USER_ROLE = {
  CLIENT: "Client",
  WORKER: "Worker",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  AGENT: "Agent",
};
const USER_GENDER = {
  MALE: "male",
  FEMALE: "female",
};
const JOB_STATUS = {
  INITIATED: "initiated",
  POSTED: "posted",
  ASSIGNED: "assigned",
  STARTED: "started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  APPROVED: "approved",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};
const JOB_APPLICATION_STATUS = {
  APPLIED: "applied",
  SELECTED: "selected",
  REJECTED: "rejected",
  COMPLETED: "completed",
};
const KYC_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};
const KYC_DOCUMENT_TYPE = {
  ID_FRONT: "id_front",
  ID_BACK: "id_back",
  SELFIE: "selfie",
  OTHER: "other",
};
const JOB_ASSET_TYPE = {
  IMAGE: "image",
  VIDEO: "video",
};
const JOB_ASSET_POSITION = {
  MAIN: "main",
  SECONDARY: "secondary",
  THIRD: "third",
  THUMBNAIL: "thumbnail",
};
const CHARGES_APPLICABLE = {
  ONLINE: "online",
  WALLET: "wallet",
  COD: "cod",
  ALL: "all",
};
const CHARGES_APPLY_ON = {
  BASE: "base",
  SUBTOTAL: "subtotal",
};
const CHARGES_TYPE = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};
const PAYMENT_METHOD = {
  ONLINE: "online",
  WALLET: "wallet",
  COD: "cod",
};
const PAYMENT_STATUS = {
  INITIATED: "initiated",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};
const ATTEMPT_STATUS = {
  ACTIVE: "active",
  ABANDONED: "abandoned",
};

const BUDGET_LIMIT = {
  LOW: 50,
  HIGH: 9999,
};

const TRANSACTION_TYPE = {
  CREDIT: "credit",
  DEBIT: "debit",
};

const WALLET_PAYMENT_PURPOSE = {
  ADD_BALANCE: "add_balance",
  WITHDRAWAL: "withdrawal",
  REPAYMENT: "repayment",
};
const WALLET_TRANSACTION_PURPOSE = {
  JOB_PAYMENT: "job_payment",
  WITHDRAWAL: "withdrawal",
  ADD_BALANCE: "add_balance",
  REPAYMENT: "repayment",
  ADJUSTMENT: "adjustment",
  REFUND: "refund",
  PENALTY: "penalty",
  COMMISION: "commision",
};
const WALLET_TRANSACTION_STATUS = {
  INITIATED: "initiated",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};
const WITHDRAW_REQUEST_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

module.exports = {
  USER_ROLE,
  USER_GENDER,
  JOB_STATUS,
  JOB_APPLICATION_STATUS,
  KYC_STATUS,
  KYC_DOCUMENT_TYPE,
  JOB_ASSET_TYPE,
  JOB_ASSET_POSITION,
  CHARGES_APPLICABLE,
  CHARGES_APPLY_ON,
  CHARGES_TYPE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ATTEMPT_STATUS,
  BUDGET_LIMIT,
  TRANSACTION_TYPE,
  WALLET_PAYMENT_PURPOSE,
  WALLET_TRANSACTION_STATUS,
  WALLET_TRANSACTION_PURPOSE,
  WITHDRAW_REQUEST_STATUS,
};
