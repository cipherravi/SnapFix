const CrudRepository = require("./crud-repository");
const { Address, Area, City, District, State } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
class AddressRepository extends CrudRepository {
  constructor() {
    super(Address);
  }
  async getAllAddresses(userId) {
    try {
      const addresses = await Address.findAll({
        where: { userId },
        order: [["id", "ASC"]],
        include: [
          {
            model: Area,
            as: "area",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: City,
                as: "city",
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: District,
                    as: "district",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                      {
                        model: State,
                        as: "state",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      return addresses;
    } catch (error) {
      logger.error(
        "Error occured in getAllAddresses of address-repository",
        error
      );

      throw error;
    }
  }
  async getById(id) {
    try {
      const address = await Address.findOne({
        where: { id },
        include: [
          {
            model: Area,
            as: "area",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: City,
                as: "city",
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: District,
                    as: "district",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                      {
                        model: State,
                        as: "state",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      return address;
    } catch (error) {
      logger.error("Error occured in getById of address-repository", error);
      throw error;
    }
  }
}

module.exports = AddressRepository;
