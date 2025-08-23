"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, { foreignKey: "userId" });
      Address.hasMany(models.Job, { foreignKey: "addressId" });
    }
  }
  Address.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      building: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
        validate: { len: [1, 30] },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [1, 30] },
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 30] },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 30] },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 30] },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 30] },
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "addresses",
      timestamps: true,
    }
  );
  return Address;
};
