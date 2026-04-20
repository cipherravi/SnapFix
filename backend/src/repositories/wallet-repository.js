const CrudRepository = require("./crud-repository");
const { Wallet } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class WalletRepository extends CrudRepository {
  constructor() {
    super(Wallet);
  }

  async findWallet(userId, options = {}) {
    try {
      const wallet = await Wallet.findOne({
        where: { userId },
        attributes: { exclude: ["updatedAt", "createdAt"] },
        ...options,
      });

      return wallet;
    } catch (error) {
      logger.error("Error occured in findWallet of wallet-repository: ", error);
      throw error;
    }
  }

  async incrementBalance(walletId, amount, options = {}) {
    try {
      const response = await Wallet.increment(
        { balance: amount },
        { where: { id: walletId }, returning: true, ...options },
      );
      return response;
    } catch (error) {
      logger.error(
        "Error occured in incrementBalance of wallet-repository: ",
        error,
      );
      throw error;
    }
  }
  async decrementBalance(walletId, amount, options = {}) {
    try {
      const response = await Wallet.decrement(
        { balance: amount },
        { where: { id: walletId }, returning: true, ...options },
      );
      return response;
    } catch (error) {
      logger.error(
        "Error occured in decrementBalance of wallet-repository: ",
        error,
      );
      throw error;
    }
  }
}

module.exports = WalletRepository;
