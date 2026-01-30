"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
      State.hasMany(models.District, {
        foreignKey: "stateId",
        as: "districts",
      });
    }
  }
  State.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [1, 30] },
      },
    },
    {
      sequelize,
      modelName: "State",
      tableName: "states",
      timestamps: true,
      underscored: true,
    },
  );
  return State;
};
