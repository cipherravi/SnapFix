const { AddressRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const addressRepository = new AddressRepository();

async function createAddress(data) {
  try {
    const response = await addressRepository.create(data);
    if (!response) {
      throw new AppError("Failed to create Address", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create address",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAllAddresses(userId) {
  try {
    const response = await addressRepository.getAllAddresses(userId);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch address",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function updateAddress() {
  try {
  } catch (error) {}
}
async function removeAddress() {
  try {
  } catch (error) {}
}

module.exports = {
  createAddress,
  getAllAddresses,
  updateAddress,
  removeAddress,
};
