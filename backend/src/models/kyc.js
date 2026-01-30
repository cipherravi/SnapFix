"use strict";
const { Model } = require("sequelize");
const { KYC_STATUS } = require("../utils/common/ENUM");
const { PENDING, REJECTED, VERIFIED } = KYC_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    static associate(models) {
      Kyc.hasMany(models.KycDocument, {
        foreignKey: "kycId",
        as: "documents",
      });
      Kyc.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Kyc.belongsTo(models.User, {
        foreignKey: "verifiedBy",
        as: "verifier",
      });
    }
  }
  Kyc.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        field: "user_id",
      },
      status: {
        type: DataTypes.ENUM(PENDING, VERIFIED, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "verified_by",
      },
    },
    {
      sequelize,
      modelName: "Kyc",
      tableName: "kycs",
      timestamps: true,
      underscored: true,
    },
  );
  return Kyc;
};
