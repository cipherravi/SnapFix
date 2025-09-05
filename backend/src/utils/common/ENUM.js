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
  POSTED: "posted",
  ASSIGNED: "assigned",
  STARTED: "started",
  COMPLETED: "completed",
  APPROVED: "approved",
  CANCELLED: "cancelled",
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
};
