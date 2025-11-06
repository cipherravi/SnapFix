const CrudRepository = require("./crud-repository");
const { State, District } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class StateRepository extends CrudRepository {
  constructor() {
    super(State);
  }

  async getDistricts(stateId) {
    try {
      const state = await State.findOne({
        where: { id: stateId },
        include: [{ model: District, as: "districts" }],
      });

      return state?.districts || [];
    } catch (error) {
      logger.error("Error occured in getDistricts of state-repository", error);
      throw error;
    }
  }
}

module.exports = StateRepository;
