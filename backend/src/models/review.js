"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER } = ENUM.USER_ROLE;

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
      Review.belongsTo(models.User, {
        foreignKey: "reviewerId",
        as: "reviewer",
        onDelete: "CASCADE",
      });
      Review.belongsTo(models.User, {
        foreignKey: "revieweeId",
        as: "reviewee",
        onDelete: "CASCADE",
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
      underscored: true,
      indexes: [
        {
          name: "idx_reviews_reviewer_id_reviewee_id_job_id_unique",
          unique: true,
          fields: ["reviewer_id", "reviewee_id", "job_id"],
        },
        {
          name: "idx_reviews_reviewer_id",
          fields: ["reviewer_id"],
        },
        {
          name: "idx_reviews_reviewee_id",
          fields: ["reviewee_id"],
        },
        {
          name: "idx_reviews_job_id",
          fields: ["job_id"],
        },
      ],
    },
  );

  return Review;
};
