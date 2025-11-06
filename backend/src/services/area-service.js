const { AreaRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const areaRepository = new AreaRepository();

async function createArea(data) {
  try {
    // check if already area exist

    const response = await areaRepository.create(data);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Area",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllAreas() {
  try {
    const response = await areaRepository.getAll();
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get all Areas",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function updateArea(id, data) {
  try {
    const response = await areaRepository.update(id, data);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update Area",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function destroyArea(id) {
  try {
    const response = await areaRepository.destroy(id);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy Area",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createArea,
  getAllAreas,
  updateArea,
  destroyArea,
};
