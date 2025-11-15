const CrudRepository = require("./crud-repository");
const { WalletTransaction } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

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
}

module.exports = WalletTransactionRepository;
