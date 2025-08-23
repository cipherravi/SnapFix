const { CityRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const cityRepository = new CityRepository();

async function createCity(data) {
  try {
    const response = await cityRepository.create(data);
    if (!response) {
      throw new AppError("Failed to create city", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create city",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getCity(cityId) {
  try {
    const response = await cityRepository.getById(cityId);
    if (!response) {
      throw new AppError("Failed to fetch city", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch city",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllCity() {
  try {
    const response = await cityRepository.getAll();
    if (!response) {
      throw new AppError("Failed to fetch All city", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All city",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateCity(cityId, data) {
  try {
    const response = await cityRepository.update(cityId, data);
    if (!response) {
      throw new AppError("Failed to update city", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update city",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function destroyCity(cityId) {
  try {
    const response = await cityRepository.destroy(cityId);
    if (!response) {
      throw new AppError("Failed to destroy city", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy city",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = { createCity, getCity, getAllCity, updateCity, destroyCity };
