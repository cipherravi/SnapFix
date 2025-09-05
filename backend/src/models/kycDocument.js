"use strict";
const { Model } = require("sequelize");

const { KYC_DOCUMENT_TYPE } = require("../utils/common/ENUM");
const { ID_BACK, ID_FRONT, SELFIE, OTHER } = KYC_DOCUMENT_TYPE;

module.exports = (sequelize, DataTypes) => {
  class KycDocument extends Model {
    static associate(models) {
      KycDocument.belongsTo(models.Kyc, { foreignKey: "kycId" });
    }
  }
  KycDocument.init(
    {
      kycId: { type: DataTypes.INTEGER, allowNull: false },
      doc_type: {
        type: DataTypes.ENUM(ID_BACK, ID_FRONT, SELFIE, OTHER),
        allowNull: false,
        defaultValue: OTHER,
      },
      doc_url: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "KycDocument",
      tableName: "kycdocuments",
    }
  );
  return KycDocument;
};
