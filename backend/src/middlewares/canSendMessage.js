const { Job } = require("../models"); // Sequelize model
// const Message = require("../models/message"); // Mongoose model
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, ENUM } = require("../utils/common");
const { APPROVED } = ENUM.JOB_STATUS;

// Middleware to check if chat is allowed
const canSendMessage = async (req, res, next) => {
  const { jobId } = req.body;
  const job = await Job.findByPk(jobId);

  if (!job) {
    ErrorResponse.message = "Job not found";
    return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
  }

  if (job.status === APPROVED) {
    const completedAt = new Date(job.updatedAt);
    const oneHourLater = new Date(completedAt.getTime() + 60 * 60 * 1000);
    if (new Date() > oneHourLater) {
      ErrorResponse.message = "Chat room is closed";
      return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }
  }

  next();
};

module.exports = canSendMessage;
