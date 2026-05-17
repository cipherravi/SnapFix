const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { NotificationService } = require("../services");
const messaging = require("../config/firebase");

async function savePushToken(req, res) {
  try {
    let { token } = req.body;

    if (!token) {
      throw new AppError("Push Token Missing", StatusCodes.BAD_REQUEST);
    }

    const userId = req.user.id;

    const response = await NotificationService.savePushToken({ userId, token });
    SuccessResponse.data = response;
    SuccessResponse.message = "Successfully Saved Push Token";
    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while saving Push Token";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function sendNotification(req, res) {
  if (!req.body) {
    throw new AppError("Empty fields", StatusCodes.BAD_REQUEST);
  }
  const { token, title, body, data } = req.body;

  try {
    const message = {
      token,

      notification: {
        title,
        body,
      },

      data: data || {},

      android: {
        priority: "high",
      },

      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const result = await messaging.send(message);

    SuccessResponse.data = result;
    SuccessResponse.message = "Notfication sent successfully";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError ? error.message : "Failed to send notification";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

// NotificationService
//  ├── sendToToken()
//  ├── sendToUser()
//  ├── sendToTopic()
//  ├── cleanupInvalidTokens()
//  ├── subscribeTopic()
//  └── unsubscribeTopic()

module.exports = { savePushToken, sendNotification };
