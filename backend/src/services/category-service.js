const { CategoryRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { getOrSetCache } = require("../utils/helper/cacheService");

const categoryRepository = new CategoryRepository();

async function createCategory(data) {
  try {
    const response = await categoryRepository.create(data);
    if (!response) {
      throw new AppError("Failed to create category", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create category",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getCategory(categoryId) {
  try {
    const response = await categoryRepository.getById(categoryId);
    if (!response) {
      throw new AppError("Failed to fetch category", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch category",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
async function getAllCategory() {
  const cacheKey = "cache:categories";

  try {
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await categoryRepository.getAll();
      },
      3600,
    );

    if (!response) {
      throw new AppError(
        "Failed to fetch All categories",
        StatusCodes.BAD_REQUEST,
      );
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to fetch All categories",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function updateCategory(categoryId, data) {
  try {
    const response = await categoryRepository.update(categoryId, data);
    if (!response) {
      throw new AppError("Failed to update category", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update category",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
async function destroyCategory(categoryId) {
  try {
    const response = await categoryRepository.destroy(categoryId);
    if (!response) {
      throw new AppError("Failed to destroy category", StatusCodes.BAD_REQUEST);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to destroy category",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

module.exports = {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  destroyCategory,
};
