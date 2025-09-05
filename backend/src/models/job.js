"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { POSTED, ASSIGNED, STARTED, COMPLETED, APPROVED, CANCELLED } =
  ENUM.JOB_STATUS;
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, { foreignKey: "userId", as: "client" });
      Job.belongsTo(models.User, { foreignKey: "workerId", as: "worker" });
      Job.belongsTo(models.City, { foreignKey: "cityId" });
      Job.belongsTo(models.Category, { foreignKey: "categoryId" });

      Job.hasMany(models.JobApplication, { foreignKey: "jobId" });
      Job.hasMany(models.Review, { foreignKey: "jobId" });
      Job.belongsTo(models.Address, { foreignKey: "addressId" });
      Job.hasMany(models.JobAsset, { foreignKey: "jobId" });
    }
  }
  Job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isValidLength(value) {
            if (value && value.length < 1) {
              throw new Error("Description cannot be empty string");
            }
            if (value && value.length > 150) {
              throw new Error("Description too long");
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          POSTED,
          ASSIGNED,
          STARTED,
          COMPLETED,
          APPROVED,
          CANCELLED
        ),
        allowNull: false,
        defaultValue: POSTED,
      },
      budget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          max: 9999,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
      },
      lng: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "jobs",
      timestamps: true,
    }
  );
  return Job;
};
