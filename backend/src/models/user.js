"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER, MODERATOR, ADMIN, AGENT } = ENUM.USER_ROLE;
const { MALE, FEMALE } = ENUM.USER_GENDER;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.City, { foreignKey: "cityId", as: "city" });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
          len: [7, 15],
        },
      },
      dateOfBirth: { type: DataTypes.DATE, allowNull: true },
      gender: {
        type: DataTypes.ENUM(MALE, FEMALE),
        allowNull: true,
      },
      profilePicUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM(CLIENT, WORKER, MODERATOR, ADMIN, AGENT),
        allowNull: false,
        defaultValue: CLIENT,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
