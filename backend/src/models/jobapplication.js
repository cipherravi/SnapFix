"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { APPLIED, SELECTED, COMPLETED, REJECTED } = ENUM.JOB_APPLICATION_STATUS;
module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    static associate(models) {
      JobApplication.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      JobApplication.belongsTo(models.User, {
        foreignKey: "userId",
        as: "worker",
      });
    }
  }
  JobApplication.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
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
      },
      selectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "JobApplication",
      tableName: "jobapplications",
      timestamps: true,
      // ✅ Composite Unique Constraint
      indexes: [
        {
          unique: true,
          fields: ["jobId", "userId"],
        },
      ],
    }
  );
  return JobApplication;
};
