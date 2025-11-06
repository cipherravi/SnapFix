"use strict";
/** @type {import('sequelize-cli').Migration} */

const { KYC_DOCUMENT_TYPE } = require("../utils/common/ENUM");
const { ID_BACK, ID_FRONT, SELFIE, OTHER } = KYC_DOCUMENT_TYPE;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kycdocuments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kycId: {
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
      doc_url: { type: Sequelize.STRING, allowNull: false, unique: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kycdocuments");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_kycdocuments_doc_type";`
    );
  },
};
