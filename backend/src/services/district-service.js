const { DistrictRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const districtRepository = new DistrictRepository();

async function createDistrict(data) {
  try {
    // check if already district exist

    const response = await districtRepository.create(data);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create District",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllDistricts() {
  try {
    const response = await districtRepository.getAll();
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get all Districts",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllCitiesOfDistrict(districtId) {
  try {
    const response = await districtRepository.getCities(districtId);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get cities of District",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateDistrict(id, data) {
  try {
    const response = await districtRepository.update(id, data);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update District",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function destroyDistrict(id) {
  try {
    const response = await districtRepository.destroy(id);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy District",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createDistrict,
  getAllDistricts,
  getAllCitiesOfDistrict,
  updateDistrict,
  destroyDistrict,
};
