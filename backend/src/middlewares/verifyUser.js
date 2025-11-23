const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { serverConfig } = require("../config");
const { SECRET_KEY } = serverConfig;

async function userVerification(req, res, next) {
  try {
    const token = req.headers["x-access-token"] || req.cookies.token;
    const header = req.headers.authorization;

    if (!token || !header) {
      throw new AppError("Token not found", StatusCodes.BAD_REQUEST);
    }
    const token1 = header.split(" ")[1];
    let isAuthenticated;
    if (token) {
      isAuthenticated = jwt.verify(token, SECRET_KEY);
    } else {
      isAuthenticated = jwt.verify(token1, SECRET_KEY);
    }
    if (!isAuthenticated) {
      throw new AppError("Unauthorised user", StatusCodes.UNAUTHORIZED);
    }

    req.user = isAuthenticated;

    next();
  } catch (error) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while verification ";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = userVerification;
