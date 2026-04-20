const CrudRepository = require("./crud-repository");
const { ChargeMaster } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
class ChargeMasterRepository extends CrudRepository {
  constructor() {
    super(ChargeMaster);
  }

  async findActiveCharges() {
    try {
      const charges = await ChargeMaster.findAll({ where: { isActive: true } });
      return charges || [];
    } catch (error) {
      logger.error(
        "Error occured in findActiveCharges of chargeMaster-repository",
        error,
      );
      throw error;
    }
  }
}

module.exports = ChargeMasterRepository;
