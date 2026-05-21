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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(FIXED, PERCENTAGE),
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      applicableMethods: {
        type: DataTypes.ENUM(ONLINE, WALLET, COD, ALL),
        defaultValue: ALL,
        allowNull: false,
        field: "applicable_methods",
      },
      applyOn: {
        type: DataTypes.ENUM(BASE, SUBTOTAL),
        allowNull: false,
        field: "apply_on",
      },
      isGrossUp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "is_gross_up",
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      sequelize,
      modelName: "ChargeMaster",
      tableName: "charges_master",
      underscored: true,
      indexes: [
        {
          name: "idx_charges_master_priority",
          fields: ["priority"],
        },
        {
          name: "idx_charges_master_is_active",
          fields: ["is_active"],
        },
      ],
    },
  );

  return ChargeMaster;
};
