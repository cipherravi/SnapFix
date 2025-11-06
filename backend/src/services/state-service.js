const { StateRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const stateRepository = new StateRepository();

async function createState(data) {
  try {
    // check if already state exist

    const response = await stateRepository.create(data);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create State",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllStates() {
  try {
    const response = await stateRepository.getAll();
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get all States",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllDistrictsOfState(stateId) {
  try {
    const response = await stateRepository.getDistricts(stateId);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get districts of State",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateState(id, data) {
  try {
    const response = await stateRepository.update(id, data);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update State",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function destroyState(id) {
  try {
    const response = await stateRepository.destroy(id);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy State",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createState,
  getAllStates,
  getAllDistrictsOfState,
  updateState,
  destroyState,
};
