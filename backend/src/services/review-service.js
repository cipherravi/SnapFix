const { ReviewRepository, JobRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { JOB_STATUS, USER_ROLE } = require("../utils/common/ENUM");
const { APPROVED } = JOB_STATUS;
const { WORKER } = USER_ROLE;
const { REVIEW } = require("../utils/constants");
const {
  ALREADY_REVIEWED,
  COMMENT_TOO_LONG,
  INVALID_RATING,
  NOT_APPROVED,
  NOT_FOUND,
  SERVER_ERROR,
} = REVIEW;

const reviewRepository = new ReviewRepository();
const jobRepository = new JobRepository();

async function createReview(reviewerId, role, jobId, rating, comment) {
  try {
    logger.info(`Creating review for jobId: ${jobId} by userId: ${reviewerId}`);

    const job = await jobRepository.findByJobId(jobId);
    let revieweeId;

    if (!job) {
      logger.warn(`Review creation failed: Job with ID ${jobId} not found.`);
      throw new AppError(NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (job.status !== APPROVED) {
      logger.warn(
        `Review creation failed: Job ${jobId} is not completed. Current status: ${job.status}`
      );
      throw new AppError(NOT_APPROVED, StatusCodes.BAD_REQUEST);
    }

    revieweeId = role === WORKER ? job.userId : job.workerId;

    const alreadyReviewed = await reviewRepository.findReview(
      reviewerId,
      jobId
    );
    if (alreadyReviewed) {
      logger.warn(
        `Duplicate review attempt: Reviewer ${reviewerId} has already reviewed job ${jobId}.`
      );
      throw new AppError(ALREADY_REVIEWED, StatusCodes.BAD_REQUEST);
    }

    if (rating < 1 || rating > 5) {
      logger.warn(`Invalid rating value: ${rating}. Expected between 1 and 5.`);
      throw new AppError(INVALID_RATING, StatusCodes.BAD_REQUEST);
    }

    if (comment && comment.length >= 200) {
      logger.warn(`Comment too long: ${comment.length} characters (max 200).`);
      throw new AppError(COMMENT_TOO_LONG, StatusCodes.BAD_REQUEST);
    }

    const review = await reviewRepository.create({
      jobId,
      reviewerId,
      revieweeId,
      role,
      rating,
      comment,
    });

    logger.info(
      `Review created successfully for jobId: ${jobId} by userId: ${reviewerId}`
    );
    return review;
  } catch (error) {
    if (error instanceof AppError) {
      logger.error(`AppError while creating review: ${error.message}`);
      throw error;
    }

    logger.error(
      `Unexpected error during review creation: ${error.message}`,
      error
    );
    throw new AppError(SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAllJobReviews(jobId) {
  try {
    logger.info(`Started fetching reviews for jobId - ${jobId}`);

    const reviews = await reviewRepository.findAllJobReviews(jobId);

    logger.info(`Successfully fetched all reviews for jobId- ${jobId}`);

    return reviews;
  } catch (error) {
    if (error instanceof AppError) {
      logger.error(`AppError while fetching job reviews: ${error.message}`);
      throw error;
    }

    logger.error(
      `Unexpected error during fetching job reviews: ${error.message}`,
      error
    );
    throw new AppError(SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
async function getAllUserReviews(userId) {
  try {
    logger.info(`Started fetching reviews for user - ${userId}`);

    const reviews = await reviewRepository.findAllUserReviews(userId);

    logger.info(`Successfully fetched all reviews for user- ${userId}`);

    return reviews;
  } catch (error) {
    if (error instanceof AppError) {
      logger.error(`AppError while fetching user reviews: ${error.message}`);
      throw error;
    }

    logger.error(
      `Unexpected error during fetching user reviews: ${error.message}`,
      error
    );
    throw new AppError(SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { createReview, getAllJobReviews, getAllUserReviews };
