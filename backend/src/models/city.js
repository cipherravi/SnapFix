"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.District, {
        foreignKey: "districtId",
        as: "district",
        onDelete: "CASCADE",
      });
      City.hasMany(models.Area, {
        foreignKey: "cityId",
        as: "areas",
      });
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
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "district_id",
      },
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
      underscored: true,
      indexes: [
        {
          name: "idx_cities_name_unique",
          unique: true,
          fields: ["name"],
        },
        {
          name: "idx_cities_district_id",
          fields: ["district_id"],
        },
      ],
    },
  );

  return City;
};
