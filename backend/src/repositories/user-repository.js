const CrudRepository = require("./crud-repository");
const { User, Kyc, City } = require("../models");
const { Op } = require("sequelize");
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
  async getById(id) {
    try {
      const response = await this.model.findByPk(id);
      logger.info("Successfully accessed getById");

      delete response.dataValues.password;
      return response;
    } catch (error) {
      logger.error("Error in user-repository - getById:", error);
      throw error;
    }
  }

  async findUser(data) {
    try {
      let condition = {};

      if (/^\d{10}$/.test(data)) {
        // Looks like a 10-digit phone number
        condition.phone = data;
      } else if (typeof data === "string" && data.includes("@")) {
        // Looks like an email
        condition.email = data;
      } else {
        throw new Error("Invalid identifier: must be email or 10-digit phone");
      }

      const userObj = await User.findOne({
        where: condition,
      });
      return userObj;
    } catch (error) {
      throw error;
    }
  }

  async fetchUsers(ids) {
    try {
      const users = await User.findAll({
        where: { id: { [Op.in]: ids } },
        attributes: ["id", "name", "profilePicUrl"],
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getByUserId(id) {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Kyc,
            as: "kyc",
            attributes: { exclude: ["userId", "verifiedBy"] },
          },
        ],
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = UserRepository;
