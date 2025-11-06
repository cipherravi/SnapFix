"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JobCharge extends Model {
    static associate(models) {
      JobCharge.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
      });

      JobCharge.belongsTo(models.ChargeMaster, {
        foreignKey: "chargeId",
        as: "charge",
      });
    }
  }
  JobCharge.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      chargeId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: "JobCharge",
      tableName: "job_charges",
      timestamps: true,
    }
  );
  return JobCharge;
};
