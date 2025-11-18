const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { serverConfig } = require("../config");
const { SECRET_KEY } = serverConfig;
const { USER_ROLE } = require("../utils/common/ENUM");
const { ADMIN } = USER_ROLE;

async function adminVerification(req, res, next) {
  try {
    const token = req.headers["x-access-token"] || req.cookies.token;

    if (!token) {
      throw new AppError("Token not found", StatusCodes.BAD_REQUEST);
    }
    const isAuthenticated = jwt.verify(token, SECRET_KEY);

    if (!isAuthenticated) {
      throw new AppError("Unauthorised user", StatusCodes.UNAUTHORIZED);
    }
    if (isAuthenticated.role !== ADMIN) {
      throw new AppError(
        "only Admin can access this route",
        StatusCodes.UNAUTHORIZED
      );
    }

    req.admin = isAuthenticated;

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

module.exports = adminVerification;
