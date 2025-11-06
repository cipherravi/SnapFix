const CrudRepository = require("./crud-repository");
const { City, Area } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
class CityRepository extends CrudRepository {
  constructor() {
    super(City);
  }

  async getAllAreas(cityId) {
    try {
      const city = await City.findOne({
        where: { id: cityId },
        include: [{ model: Area, as: "areas" }],
      });
      return city?.areas || [];
    } catch (error) {
      logger.error("Error occured in getAllAreas of city-repository", error);
      throw error;
    }
  }
}
module.exports = CityRepository;
