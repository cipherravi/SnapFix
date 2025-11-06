const CrudRepository = require("./crud-repository");
const { District, City } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class DistrictRepository extends CrudRepository {
  constructor() {
    super(District);
  }

  async getCities(districtId) {
    try {
      const district = await District.findOne({
        where: { id: districtId },
        include: [{ model: City, as: "cities" }],
      });

      return district?.cities || [];
    } catch (error) {
      logger.error("Error occured in getCities of district-repository", error);
      throw error;
    }
  }
}

module.exports = DistrictRepository;
