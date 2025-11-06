"use strict";
const { Model } = require("sequelize");
const {
  CHARGES_APPLICABLE,
  CHARGES_TYPE,
  CHARGES_APPLY_ON,
} = require("../utils/common/ENUM");
const { ALL, COD, ONLINE, WALLET } = CHARGES_APPLICABLE;
const { FIXED, PERCENTAGE } = CHARGES_TYPE;
const { BASE, SUBTOTAL } = CHARGES_APPLY_ON;

module.exports = (sequelize, DataTypes) => {
  class ChargeMaster extends Model {
    static associate(models) {
      ChargeMaster.hasMany(models.JobCharge, {
        foreignKey: "chargeId",
        as: "job_charges",
      });
    }
  }
  ChargeMaster.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM(FIXED, PERCENTAGE),
        validate: {
          isIn: [[FIXED, PERCENTAGE]],
        },
      },
      value: DataTypes.DECIMAL(10, 2),
      applicable_methods: {
        type: DataTypes.ENUM(ONLINE, WALLET, COD, ALL),
        defaultValue: ALL,
        allowNull: false,
      },
      apply_on: { type: DataTypes.ENUM(BASE, SUBTOTAL) },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_gross_up: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      priority: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "ChargeMaster",
      tableName: "charges_master",
      timestamps: true,
    }
  );
  return ChargeMaster;
};
