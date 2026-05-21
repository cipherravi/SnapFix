"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JobCharge extends Model {
    static associate(models) {
      JobCharge.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
      JobCharge.belongsTo(models.ChargeMaster, {
        foreignKey: "chargeId",
        as: "charge",
        onDelete: "CASCADE",
      });
    }
  }

  JobCharge.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
      chargeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "charge_id",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JobCharge",
      tableName: "job_charges",
      underscored: true,
      indexes: [
        {
          name: "idx_job_charges_job_id_charge_id_unique",
          unique: true,
          fields: ["job_id", "charge_id"],
        },
        {
          name: "idx_job_charges_job_id",
          fields: ["job_id"],
        },
        {
          name: "idx_job_charges_charge_id",
          fields: ["charge_id"],
        },
      ],
    },
  );

  return JobCharge;
};
