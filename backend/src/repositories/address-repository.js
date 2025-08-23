const CrudRepository = require("./crud-repository");
const { Address } = require("../models");

class AddressRepository extends CrudRepository {
  constructor() {
    super(Address);
  }
  async getAllAddresses(userId) {
    try {
      const addresses = await Address.findAll({ where: { userId } });

      return addresses;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = AddressRepository;
