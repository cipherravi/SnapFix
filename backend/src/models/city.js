"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.District, {
        foreignKey: "districtId",
        as: "district",
      });
      City.hasMany(models.Area, { foreignKey: "cityId", as: "areas" });
      City.hasMany(models.Address, {
        foreignKey: "cityId",
        as: "addresses",
      });
    }
  }

  City.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [1, 30] },
      },
      districtId: { type: DataTypes.INTEGER, allowNull: false },
      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 20], isNumeric: true },
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
