const CrudRepository = require("./crud-repository");
const { WalletLedger } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class WalletLedgerRepository extends CrudRepository {
  constructor() {
    super(WalletLedger);
  }
  async lastEntry(walletId, options = {}) {
    try {
      const lastEntry = await WalletLedger.findOne({
        where: { walletId },
        order: [["id", "DESC"]],
        ...options,
      });
      return lastEntry;
    } catch (error) {
      logger.error(
        "Error occured in lastEntry of walletLedger-repository: ",
        error,
      );
      throw error;
    }
  }
}
module.exports = WalletLedgerRepository;
