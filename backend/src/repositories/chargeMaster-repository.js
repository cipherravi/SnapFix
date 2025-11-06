const CrudRepository = require("./crud-repository");
const { ChargeMaster } = require("../models");
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
        error
      );
      throw error;
    }
  }
}

module.exports = ChargeMasterRepository;
