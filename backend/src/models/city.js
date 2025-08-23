"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      // One city has many users and jobs
      City.hasMany(models.User, { foreignKey: "cityId", as: "city" });
      City.hasMany(models.Job, { foreignKey: "cityId" });
    }
  }

  City.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 30] },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 20] },
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isInt: true, len: [1, 20] },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "City",
      tableName: "cities",
      timestamps: true,
    }
  );

  return City;
};
