"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { JOB_STATUS, ATTEMPT_STATUS } = ENUM;
const {
  INITIATED,
  POSTED,
  ASSIGNED,
  STARTED,
  IN_PROGRESS,
  COMPLETED,
  APPROVED,
  CANCELLED,
  EXPIRED,
} = JOB_STATUS;
const { ACTIVE } = ATTEMPT_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, {
        foreignKey: "userId",
        as: "client",
        onDelete: "CASCADE",
      });
      Job.belongsTo(models.User, {
        foreignKey: "workerId",
        as: "worker",
        onDelete: "SET NULL",
      });
      Job.belongsTo(models.City, {
        foreignKey: "cityId",
        as: "city",
        onDelete: "SET NULL",
      });
      Job.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL",
      });
      Job.belongsTo(models.Address, {
        foreignKey: "addressId",
        as: "address",
        onDelete: "SET NULL",
      });

      Job.hasMany(models.JobApplication, {
        foreignKey: "jobId",
        as: "applications",
      });
      Job.hasMany(models.Review, { foreignKey: "jobId", as: "reviews" });
      Job.hasMany(models.JobAsset, { foreignKey: "jobId", as: "assets" });
      Job.hasMany(models.JobCharge, {
        foreignKey: "jobId",
        as: "job_charges",
      });
      Job.hasMany(models.Payment, { foreignKey: "jobId", as: "payments" });
      Job.hasOne(models.Payment, {
        foreignKey: "jobId",
        as: "activePayment",
        scope: { attempt_status: ACTIVE },
      });
      Job.hasMany(models.JobHistory, { foreignKey: "jobId", as: "joblogs" });
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
          INITIATED,
          POSTED,
          ASSIGNED,
          STARTED,
          IN_PROGRESS,
          COMPLETED,
          APPROVED,
          CANCELLED,
          EXPIRED,
        ),
        allowNull: false,
        defaultValue: INITIATED,
      },
      budget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          max: 9999,
          min: 1,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      workerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "worker_id",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "category_id",
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "city_id",
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "address_id",
      },
      initialAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        comment:
          "Static address string for this job; not tied to user's current address",
        field: "initial_address",
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "jobs",
      underscored: true,
      indexes: [
        {
          name: "idx_jobs_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_jobs_worker_id",
          fields: ["worker_id"],
        },
        {
          name: "idx_jobs_category_id",
          fields: ["category_id"],
        },
        {
          name: "idx_jobs_city_id",
          fields: ["city_id"],
        },
        {
          name: "idx_jobs_address_id",
          fields: ["address_id"],
        },
        {
          name: "idx_jobs_status",
          fields: ["status"],
        },
      ],
    },
  );

  return Job;
};
