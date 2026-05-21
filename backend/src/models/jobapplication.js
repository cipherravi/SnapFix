"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { APPLIED, SELECTED, COMPLETED, REJECTED } = ENUM.JOB_APPLICATION_STATUS;

module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    static associate(models) {
      JobApplication.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
      JobApplication.belongsTo(models.User, {
        foreignKey: "userId",
        as: "worker",
        onDelete: "CASCADE",
      });
    }
  }

  JobApplication.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 150],
        },
      },
      status: {
        type: DataTypes.ENUM(APPLIED, SELECTED, COMPLETED, REJECTED),
        allowNull: false,
        defaultValue: APPLIED,
      },
      appliedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "applied_at",
      },
      selectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "selected_at",
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "completed_at",
      },
    },
    {
      sequelize,
      modelName: "JobApplication",
      tableName: "job_applications",
      underscored: true,
      indexes: [
        {
          name: "idx_job_applications_job_id_user_id_unique",
          unique: true,
          fields: ["job_id", "user_id"],
        },
        {
          name: "idx_job_applications_job_id",
          fields: ["job_id"],
        },
        {
          name: "idx_job_applications_user_id",
          fields: ["user_id"],
        },
      ],
    },
  );

  return JobApplication;
};
