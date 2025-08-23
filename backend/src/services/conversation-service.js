const { ConversationRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const conversationRepository = new ConversationRepository();

async function getAllUserConversations(userId) {
  try {
    const response = await conversationRepository.getConversationsbyUserId(
      userId
    );
    if (!response) {
      throw new AppError(
        `Failed to fetch conversations for userId - ${userId}`,
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All conversations",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getConversationIdByJobId(userId, jobId) {
  try {
    const response = await conversationRepository.getConversationId(
      userId,
      jobId
    );
    if (!response) {
      throw new AppError(
        `Failed to fetch conversation for userId - ${userId} and jobId - ${jobId}`,
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch conversation",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getConversationMessages(conversationId, before) {
  try {
    const response = await conversationRepository.getMessagesbyConversationId(
      conversationId,
      before
    );
    if (!response) {
      throw new AppError(
        `Failed to fetch messages for conversation - ${conversationId}`,
        StatusCodes.BAD_REQUEST
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All messages",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  getAllUserConversations,
  getConversationIdByJobId,
  getConversationMessages,
};
