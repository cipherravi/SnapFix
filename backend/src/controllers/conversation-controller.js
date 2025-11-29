const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { ConversationService } = require("../services");

async function getAllUserConversations(req, res) {
  try {
    const userId = req.user.id;
    const response = await ConversationService.getAllUserConversations(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched conversations";
    logger.info(`Successfully fetched conversations for userId - ${userId}`);
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching conversations";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getConversationIdByJobId(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.query;
    const response = await ConversationService.getConversationIdByJobId(
      userId,
      jobId
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched conversation";
    logger.info(
      `Successfully fetched conversation for userId - ${userId}, jobId - ${jobId}`
    );
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching conversation";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getConversationMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const { before } = req.query;

    const response = await ConversationService.getConversationMessages(
      conversationId,
      before
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched messages";
    logger.info(
      `Successfully fetched messages for conversationId - ${conversationId}`
    );
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching messages";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getUnreadCountOfUser(req, res) {
  try {
    const userId = req.user.id;
    const response = await ConversationService.getUnreadCountOfUser(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched unread count";
    logger.info(`Successfully fetched unread count for userId - ${userId}`);
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching unread count";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getConversationById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const response = await ConversationService.getConversationById(userId, id);

    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully fetched conversation";
    logger.info(`Successfully fetched conversation id - ${id} by - ${userId}`);
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while conversation ";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  getAllUserConversations,
  getConversationIdByJobId,
  getConversationMessages,
  getUnreadCountOfUser,
  getConversationById,
};
