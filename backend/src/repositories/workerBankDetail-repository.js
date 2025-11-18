const CrudRepository = require("./crud-repository");
const { WorkerBankDetail } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class WorkerBankDetailRepository extends CrudRepository {
  constructor() {
    super(WorkerBankDetail);
  }

  async fetchAllBankDetailsOfWorker(userId) {
    logger.info("Repository: Fetch all bank details for worker - START", {
      userId,
    });

    try {
      const bankDetails = await WorkerBankDetail.findAll({
        where: { userId, isActive: true },
      });

      logger.info("Repository: Fetched worker bank details", {
        userId,
        count: bankDetails.length,
      });

      return bankDetails;
    } catch (error) {
      logger.error("Repository Error: fetchAllBankDetailsOfWorker failed", {
        userId,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async fetchBankDetailOfWorkerById(id) {
    logger.info("Repository: Fetch bank detail by ID - START", { id });

    try {
      const bankDetail = await WorkerBankDetail.findOne({
        where: { id, isActive: true },
      });

      logger.info("Repository: Bank detail fetched", {
        id,
        found: !!bankDetail,
      });

      return bankDetail;
    } catch (error) {
      logger.error("Repository Error: fetchBankDetailOfWorkerById failed", {
        id,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async markDeleteForBankAccount(id) {
    logger.info("Repository: Soft delete bank detail - START", { id });

    try {
      const result = await WorkerBankDetail.update(
        { isActive: false },
        { where: { id } }
      );

      logger.info("Repository: Bank detail marked inactive", {
        id,
        affectedRows: result[0],
      });

      return result;
    } catch (error) {
      logger.error("Repository Error: markDeleteForBankAccount failed", {
        id,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = WorkerBankDetailRepository;
