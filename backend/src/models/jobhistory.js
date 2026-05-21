"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JobHistory extends Model {
    static associate(models) {
      JobHistory.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
      JobHistory.belongsTo(models.User, {
        foreignKey: "changedBy",
        as: "changedByUser",
        onDelete: "CASCADE",
      });
    }
  }

  JobHistory.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
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
      underscored: true,
      indexes: [
        {
          name: "idx_job_histories_job_id",
          fields: ["job_id"],
        },
        {
          name: "idx_job_histories_changed_by",
          fields: ["changed_by"],
        },
      ],
    },
  );

  return JobHistory;
};
