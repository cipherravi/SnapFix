const CrudRepository = require("./crud-repository");
const { WalletTransaction } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { Op } = require("sequelize");

class WalletTransactionRepository extends CrudRepository {
  constructor() {
    super(WalletTransaction);
  }
  async getByReference(reference) {
    try {
      const transaction = await WalletTransaction.findOne({
        where: { reference },
      });
      return transaction;
    } catch (error) {
      logger.error(
        "Error occured in getByReference of walletTransaction-repository: ",
        error
      );
      throw error;
    }
  }

  async getByReferenceWithFilters(reference, filters = {}) {
    try {
      return await WalletTransaction.findOne({
        where: {
          reference,
          ...filters,
        },
      });
    } catch (error) {
      logger.error(
        "Error occurred in getSuccessfulCreditByReference of walletTransaction-repository:",
        error
      );
      throw error;
    }
  }

  async getAllTransactionsByWalletId(walletId, filters = {}) {
    try {
      const {
        status,
        transaction_type,
        purpose,
        minAmount,
        maxAmount,
        reference,
        sortBy = "createdAt",
        sortOrder = "DESC",
        startDate,
        endDate,
        limit,
      } = filters;

      const where = { walletId };

      // STATUS
      if (status) where.status = status;

      // TRANSACTION TYPE
      if (transaction_type) where.transaction_type = transaction_type;

      // PURPOSE
      if (purpose) where.purpose = purpose;

      // REFERENCE
      if (reference) where.reference = reference;

      // AMOUNT RANGE
      if (minAmount || maxAmount) {
        where.amount = {};
        if (minAmount) where.amount[Op.gte] = minAmount;
        if (maxAmount) where.amount[Op.lte] = maxAmount;
      }

      // DATE RANGE
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }

      // SORTING
      const order = [[sortBy, sortOrder.toUpperCase()]];

      const transactions = await WalletTransaction.findAll({
        where,
        order,
        limit: limit ? Number(limit) : undefined,
      });
      return transactions;
    } catch (error) {
      logger.error(
        "Error occurred in getAllTransactionsByWalletId of walletTransaction-repository:",
        error
      );
      throw error;
    }
  }
}

module.exports = WalletTransactionRepository;
