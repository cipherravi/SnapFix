"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      District.belongsTo(models.State, {
        foreignKey: "stateId",
        as: "state",
        onDelete: "CASCADE",
      });
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
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "state_id",
      },
    },
    {
      sequelize,
      modelName: "District",
      tableName: "districts",
      underscored: true,
      indexes: [
        {
          name: "idx_districts_name_unique",
          unique: true,
          fields: ["name"],
        },
        {
          name: "idx_districts_state_id",
          fields: ["state_id"],
        },
      ],
    },
  );

  return District;
};
