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
      changedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "changed_by",
      },
      oldStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "old_status",
      },
      newStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "new_status",
      },
    },
    {
      sequelize,
      modelName: "JobHistory",
      tableName: "job_histories",
      timestamps: true,
      underscored: true,
    },
  );
  return JobHistory;
};
