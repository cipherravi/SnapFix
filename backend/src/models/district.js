"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      District.belongsTo(models.State, { foreignKey: "stateId", as: "state" });
      District.hasMany(models.City, {
        foreignKey: "districtId",
        as: "cities",
      });
    }
  }
  District.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [1, 30] },
      },
      stateId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "District",
      tableName: "districts",
      timestamps: true,
    }
  );
  return District;
};
