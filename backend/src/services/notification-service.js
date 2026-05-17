const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const { NotificationRepositoryRepository } = require("../repositories");

const notificationRepositoryRepository = new NotificationRepositoryRepository();

async function savePushToken(data) {
  try {
    const response = await notificationRepositoryRepository.savePushToken(data);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to save Push token",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

module.exports = { savePushToken };
