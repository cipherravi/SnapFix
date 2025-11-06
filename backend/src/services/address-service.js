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
      "Failed to fetch addresses",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getAddress(id) {
  try {
    const response = await addressRepository.getById(id);

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
async function updateAddress(addressId, data) {
  try {
    // verify does address exist??
    // check that address belong to user??
    //update address

    const address = await addressRepository.getById(addressId);
    if (!address) {
      throw new AppError("Address doesn't exisits", StatusCodes.NOT_FOUND);
    }

    if (data.userId !== address.userId) {
      throw new AppError(
        "Address doesn't belong to you",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await addressRepository.update(addressId, data);

    if (!response) {
      throw new AppError("Failed to update address", StatusCodes.BAD_REQUEST);
    }

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update address",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function removeAddress(userId, addressId) {
  try {
    // check does address exist??
    // check does address id === userId ??
    // then delete

    const address = await addressRepository.getById(addressId);

    if (!address) {
      throw new AppError(
        "Failed to remove, Address doesn't exists",
        StatusCodes.NOT_FOUND
      );
    }

    if (address.userId !== Number(userId)) {
      throw new AppError(
        "Failed to remove, Address doesn't belong to you",
        StatusCodes.NOT_FOUND
      );
    }

    const response = await addressRepository.destroy(addressId);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update address",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createAddress,
  getAllAddresses,
  getAddress,
  updateAddress,
  removeAddress,
};
