"use strict";
const { Model } = require("sequelize");
const { KYC_STATUS } = require("../utils/common/ENUM");
const { PENDING, REJECTED, VERIFIED } = KYC_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    static associate(models) {
      Kyc.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
      Kyc.belongsTo(models.User, {
        foreignKey: "verifiedBy",
        as: "verifier",
        onDelete: "SET NULL",
      });
      Kyc.hasMany(models.KycDocument, {
        foreignKey: "kycId",
        as: "documents",
      });
    }
  }

  Kyc.init(
    {
      userId: {
        type: DataTypes.INTEGER,
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
      underscored: true,
      indexes: [
        {
          name: "idx_kycs_user_id_unique",
          unique: true,
          fields: ["user_id"],
        },
        {
          name: "idx_kycs_verified_by",
          fields: ["verified_by"],
        },
        {
          name: "idx_kycs_status",
          fields: ["status"],
        },
      ],
    },
  );

  return Kyc;
};
