"use strict";
const { Model } = require("sequelize");
const { KYC_STATUS } = require("../utils/common/ENUM");
const { PENDING, REJECTED, VERIFIED } = KYC_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    static associate(models) {
      Kyc.hasMany(models.KycDocument, { foreignKey: "kycId" });
      Kyc.belongsTo(models.User, { foreignKey: "userId" });
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
      },
      status: {
        type: DataTypes.ENUM(PENDING, VERIFIED, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
      },
      verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Kyc",
      tableName: "kycs",
    }
  );
  return Kyc;
};
