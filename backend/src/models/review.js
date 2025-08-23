"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER } = ENUM.USER_ROLE;

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Job, { foreignKey: "jobId" });
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
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      revieweeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["reviewerId", "revieweeId", "jobId"],
        },
      ],
    }
  );

  return Review;
};
