"use strict";
const { Model } = require("sequelize");
const { KYC_DOCUMENT_TYPE } = require("../utils/common/ENUM");
const { ID_BACK, ID_FRONT, SELFIE, OTHER } = KYC_DOCUMENT_TYPE;

module.exports = (sequelize, DataTypes) => {
  class KycDocument extends Model {
    static associate(models) {
      KycDocument.belongsTo(models.Kyc, {
        foreignKey: "kycId",
        as: "kyc",
        onDelete: "CASCADE",
      });
    }
  }

  KycDocument.init(
    {
      kycId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "kyc_id",
      },
      docType: {
        type: DataTypes.ENUM(ID_BACK, ID_FRONT, SELFIE, OTHER),
        allowNull: false,
        defaultValue: OTHER,
        field: "doc_type",
      },
      docUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "doc_url",
        validate: {
          len: [5, 100],
        },
      },
    },
    {
      sequelize,
      modelName: "KycDocument",
      tableName: "kyc_documents",
      underscored: true,
      indexes: [
        {
          name: "idx_kyc_documents_doc_url_unique",
          unique: true,
          fields: ["doc_url"],
        },
        {
          name: "idx_kyc_documents_kyc_id",
          fields: ["kyc_id"],
        },
      ],
    },
  );

  return KycDocument;
};
