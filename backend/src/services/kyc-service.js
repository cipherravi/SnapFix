const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const { KycRepository, KycDocumentRepository } = require("../repositories");

const kycRepository = new KycRepository();
const kycDocumentRepository = new KycDocumentRepository();

async function createKyc(data) {
  try {
    const hasUserApplied = await kycRepository.getByUserId(data.userId);
    if (hasUserApplied) {
      throw new AppError(
        "User's Kyc Application already Submitted, Please allow us some time to verify application",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await kycRepository.create(data);

    delete response.dataValues.verifiedBy;

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Kyc Application",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function createKycDocument(data) {
  try {
    const kycApplication = await kycRepository.getById(data.kycId);

    if (!kycApplication) {
      throw new AppError(
        "Cannot add documents for a KYC application that doesn't exist",
        StatusCodes.BAD_REQUEST
      );
    }
    const document = await kycDocumentRepository.create(data);

    return document;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to create Kyc Application document",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { createKyc, createKycDocument };
