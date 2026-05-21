"use strict";
const { KYC_DOCUMENT_TYPE } = require("../utils/common/ENUM");
const { ID_BACK, ID_FRONT, SELFIE, OTHER } = KYC_DOCUMENT_TYPE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kyc_documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kyc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kycs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      doc_type: {
        type: Sequelize.ENUM(ID_BACK, ID_FRONT, SELFIE, OTHER),
        allowNull: false,
        defaultValue: OTHER,
      },
      doc_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Unique index mapping for document URLs to prevent identical document duplicate leaks
    await queryInterface.addIndex("kyc_documents", ["doc_url"], {
      name: "idx_kyc_documents_doc_url_unique",
      unique: true,
    });

    // Relational performance performance lookup index for parent KYC profile assemblies
    await queryInterface.addIndex("kyc_documents", ["kyc_id"], {
      name: "idx_kyc_documents_kyc_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kyc_documents");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_kyc_documents_doc_type" CASCADE;',
    );
  },
};
