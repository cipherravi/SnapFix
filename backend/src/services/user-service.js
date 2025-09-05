const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const {
  SALT_ROUNDS,
  SECRET_KEY,
  EXPIRES_IN,
} = require("../config/server-config");

const { USER } = require("../utils/constants");
const {
  SIGNUP_FAILED,
  SIGNUP_DUPLICATE,
  LOGIN_MISSING_CREDENTIALS,
  LOGIN_USER_NOT_FOUND,
  LOGIN_INCORRECT_PASSWORD,
  USER_NOT_FOUND,
  FIELD_IMMUTABLE,
  UPDATE_FAILED,
} = USER;

const userRepository = new UserRepository();

async function signup(name, phone, password) {
  const passwordHash = await bcrypt.hash(password, +SALT_ROUNDS);

  try {
    const response = await userRepository.create({
      name,
      phone,
      password: passwordHash,
    });

    delete response.dataValues.password;
    return response;
  } catch (error) {
    logger.error("Signup failed:", error.stack || error.message);
    if (error.name === "SequelizeUniqueConstraintError") {
      const explanation = error.errors.map((err) => err.message);
      logger.error(explanation);
      throw new AppError(SIGNUP_DUPLICATE, StatusCodes.BAD_REQUEST);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(SIGNUP_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function login(phone, email, password) {
  try {
    let user;

    if (phone) {
      user = await userRepository.findUser(phone);
    } else if (email) {
      user = await userRepository.findUser(email);
    } else {
      throw new AppError(LOGIN_MISSING_CREDENTIALS, StatusCodes.BAD_REQUEST);
    }

    if (!user) {
      throw new AppError(LOGIN_USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      throw new AppError(LOGIN_INCORRECT_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      issuedAt: new Date(),
    };

    const token = await jwt.sign(payload, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
    });

    return token;
  } catch (error) {
    logger.error(error.stack || error.message);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
}

async function getProfile(id) {
  try {
    const user = await userRepository.getByUserId(id);

    if (!user) {
      throw new AppError(USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return user;
  } catch (error) {
    logger.error(error.stack || error.message);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
}
async function getProfiles(ids) {
  try {
    const users = await userRepository.fetchUsers(ids);

    if (!users) {
      throw new AppError(USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return users;
  } catch (error) {
    logger.error(error.stack || error.message);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
}

async function updateUser(userId, updateData) {
  try {
    const findUser = await userRepository.getById(userId);
    const oneTimeAllowed = ["dateOfBirth", "gender"];

    for (const key in updateData) {
      if (oneTimeAllowed.includes(key)) {
        if (findUser[key] !== null && findUser[key] !== undefined) {
          throw new AppError(FIELD_IMMUTABLE(key), StatusCodes.BAD_REQUEST);
        }
      }
    }

    const updateUser = await userRepository.update(userId, updateData);
    return updateUser;
  } catch (error) {
    logger.error("Update user failed:", error.stack || error.message);
    if (error.name === "SequelizeValidationError") {
      const explanation = error.errors.map((err) => err.message);
      logger.error(explanation);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(UPDATE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  signup,
  login,
  getProfile,
  getProfiles,
  updateUser,
};
