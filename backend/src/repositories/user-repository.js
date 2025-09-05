const CrudRepository = require("./crud-repository");
const { User, Kyc, City } = require("../models");
const { Op } = require("sequelize");
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
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
          { model: Kyc, attributes: { exclude: ["userId", "verifiedBy"] } },
          {
            model: City,
            as: "city",
            attributes: { exclude: ["createdAt", "updatedAt"] },
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
