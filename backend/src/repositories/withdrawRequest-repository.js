const CrudRepository = require("./crud-repository");
const { WithdrawRequest } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
class WithdrawRequestRepository extends CrudRepository {
  constructor() {
    super(WithdrawRequest);
  }

  async fetchAllWithdrawalsByUserId(userId) {
    logger.info("Repository: Fetch All Withdrawals - START", { userId });

    try {
      const withdrawals = await WithdrawRequest.findAll({
        where: { userId },
      });

      logger.info("Repository: Fetch All Withdrawals - SUCCESS", {
        userId,
        count: withdrawals.length,
      });

      return withdrawals;
    } catch (error) {
      logger.error("Repository Error: Fetch All Withdrawals Failed", {
        userId,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }
}

module.exports = WithdrawRequestRepository;
