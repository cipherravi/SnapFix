"use strict";
const { Model, DATE } = require("sequelize");
const { ENUM } = require("../utils/common");
const { APPLIED, SELECTED, COMPLETED, REJECTED } = ENUM.JOB_APPLICATION_STATUS;
module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    static associate(models) {
      JobApplication.belongsTo(models.Job, { foreignKey: "jobId" });
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
