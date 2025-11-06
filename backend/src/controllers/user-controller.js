const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { UserService } = require("../services");

const { USER } = require("../utils/constants");
const {
  SIGNUP_FAILED,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  MISSING_TOKEN,
  PROFILE_SUCCESS,
  PROFILE_NOT_FOUND,
  PROFILE_FAILED,
  UPDATE_SUCCESS,
  UPDATE_FAILED,
  EMPTY_UPDATE_BODY,
} = USER;

async function signup(req, res) {
  const { name, phone, email, password } = req.body;
  try {
    const response = await UserService.signup(name, phone, email, password);

    if (!response) {
      throw new AppError(SIGNUP_FAILED, StatusCodes.BAD_REQUEST);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = SIGNUP_SUCCESS;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : SIGNUP_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function login(req, res) {
  const { email, phone, password } = req.body;
  try {
    const response = await UserService.login(email, phone, password);

    if (!response) {
      throw new AppError(LOGIN_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.cookie("token", response, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for dev, None for prod
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    SuccessResponse.data = response;
    SuccessResponse.message = LOGIN_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : LOGIN_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError(MISSING_TOKEN, StatusCodes.UNAUTHORIZED);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    SuccessResponse.data = {};
    SuccessResponse.message = LOGOUT_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : LOGOUT_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    const response = await UserService.getMyProfile(userId);
    if (!response) {
      throw new AppError(PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = PROFILE_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : PROFILE_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getProfile(req, res) {
  try {
    let id = Number(req.params.id) ? req.params.id : req.user.id;

    const response = await UserService.getProfile(id);
    if (!response) {
      throw new AppError(PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = PROFILE_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : PROFILE_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function getProfiles(req, res) {
  try {
    let { ids } = req.query;

    // Normalize to array
    if (typeof ids === "string") {
      ids = [ids];
    }
    if (!Array.isArray(ids)) {
      throw new AppError("ids must be an array", StatusCodes.BAD_REQUEST);
    }

    // Convert to numbers
    const idArray = ids.map((id) => Number(id)).filter((id) => !isNaN(id));

    const response = await UserService.getProfiles(idArray);
    if (!response) {
      throw new AppError(PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    SuccessResponse.data = response;
    SuccessResponse.message = PROFILE_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : PROFILE_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user.id;

    const allowedFields = [
      "name",
      "email",
      "phone",
      "profilePicUrl",
      "dateOfBirth",
      "gender",
      "cityId",
    ];
    const updateData = {};

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(EMPTY_UPDATE_BODY, StatusCodes.BAD_REQUEST);
    }

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const response = await UserService.updateUser(userId, updateData);

    SuccessResponse.data = response;
    SuccessResponse.message = UPDATE_SUCCESS;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppError ? error.message : UPDATE_FAILED;
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  signup,
  login,
  logout,
  getProfile,
  getMyProfile,
  getProfiles,
  updateUser,
};
