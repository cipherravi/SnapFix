"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER, MODERATOR, ADMIN, AGENT } = ENUM.USER_ROLE;
const { MALE, FEMALE } = ENUM.USER_GENDER;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Kyc, { foreignKey: "userId", as: "kyc" });
      User.hasMany(models.PushToken, { foreignKey: "userId", as: "tokens" });
      User.hasMany(models.Address, {
        foreignKey: "userId",
        as: "addresses",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [5, 30] },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 40],
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
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "date_of_birth",
      },
      gender: {
        type: DataTypes.ENUM(MALE, FEMALE),
        allowNull: true,
      },
      profilePicUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [10, 100] },
        field: "profile_pic_url",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [10, 100] },
      },
      role: {
        type: DataTypes.ENUM(CLIENT, WORKER, MODERATOR, ADMIN, AGENT),
        allowNull: false,
        defaultValue: CLIENT,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
    },
  );
  return User;
};
