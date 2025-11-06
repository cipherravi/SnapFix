const { ChargeMasterRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const chargeMasterRepository = new ChargeMasterRepository();

async function createCharge(data) {
  try {
    const response = await chargeMasterRepository.create(data);
    if (!response) {
      throw new AppError("Failed to create charge", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create charge",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createCharge };
