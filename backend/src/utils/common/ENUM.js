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

module.exports = { USER_ROLE, USER_GENDER, JOB_STATUS, JOB_APPLICATION_STATUS };
