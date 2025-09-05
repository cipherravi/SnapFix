const CrudRepository = require("./crud-repository");
const { Kyc } = require("../models");
const { where } = require("../models/conversation");

class KycRepository extends CrudRepository {
  constructor() {
    super(Kyc);
  }
  async getByUserId(userId) {
    try {
      const kyc = await Kyc.findOne({ where: { userId } });
      return kyc;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = KycRepository;
