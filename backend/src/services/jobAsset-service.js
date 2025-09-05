const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const { JobRepository, JobAssetRepository } = require("../repositories");
const jobAssetRepository = new JobAssetRepository();
const jobRepository = new JobRepository();

async function createJobAsset(data) {
  try {
    const response = await jobRepository.getById(data.jobId);

    if (!response) {
      throw new AppError(
        "Cannot add documents for a Job that doesn't exist",
        StatusCodes.BAD_REQUEST
      );
    }

    const document = await jobAssetRepository.create(data);

    return document;
  } catch (error) {
    logger.error(error.stack || error.message);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Job asset document",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createJobAsset };
