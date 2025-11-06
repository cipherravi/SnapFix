"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobHistory extends Model {
    static associate(models) {
      JobHistory.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
      });
      JobHistory.belongsTo(models.User, {
        foreignKey: "changedBy",
        as: "changedByUser",
      });
    }
  }
  JobHistory.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      changedBy: { type: DataTypes.INTEGER, allowNull: false },
      oldStatus: { type: DataTypes.STRING(20), allowNull: false },
      newStatus: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      sequelize,
      modelName: "JobHistory",
      tableName: "job_histories",
      timestamps: true,
    }
  );
  return JobHistory;
};
