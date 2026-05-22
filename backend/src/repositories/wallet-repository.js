const CrudRepository = require("./crud-repository");
const { Wallet } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { Op } = require("sequelize");

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
      // Ensure we aren't adding a negative number or a weird string format
      const cleanAmount = parseFloat(amount);
      if (isNaN(cleanAmount) || cleanAmount <= 0) {
        throw new Error(`Invalid increment amount: ${amount}`);
      }

      const response = await Wallet.increment(
        { balance: cleanAmount },
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
      const cleanAmount = parseFloat(amount);
      if (isNaN(cleanAmount) || cleanAmount <= 0) {
        throw new Error(`Invalid decrement amount: ${amount}`);
      }

      // 🛡️ THE SAFETY NET: Inject an extra WHERE condition so the balance
      // can NEVER be drawn below what is being deducted.
      const [affectedRows] = await Wallet.decrement(
        { balance: cleanAmount },
        {
          where: {
            id: walletId,
            balance: { [Op.gte]: cleanAmount }, // balance must be >= cleanAmount
          },
          ...options,
        },
      );

      // Sequelize's decrement returns metadata about affected rows.
      // If affectedRows is 0, it means the query didn't match because of insufficient balance!
      if (affectedRows === 0) {
        throw new Error("Insufficient wallet balance");
      }

      return affectedRows;
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
