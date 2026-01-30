"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER } = ENUM.USER_ROLE;

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      Review.belongsTo(models.User, {
        foreignKey: "reviewerId",
        as: "reviewer",
      });
      Review.belongsTo(models.User, {
        foreignKey: "revieweeId",
        as: "reviewee",
      });
    }
  }

  Review.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "reviewer_id",
      },
      revieweeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "reviewee_id",
      },
      role: {
        type: DataTypes.ENUM(CLIENT, WORKER),
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isValidLength(value) {
            if (value && value.length < 1) {
              throw new Error("Comment cannot be empty string");
            }
            if (value && value.length > 50) {
              throw new Error("Comment too long");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["reviewerId", "revieweeId", "jobId"],
        },
      ],
    },
  );

  return Review;
};
