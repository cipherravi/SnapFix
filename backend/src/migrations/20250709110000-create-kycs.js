"use strict";
/** @type {import('sequelize-cli').Migration} */
const { KYC_STATUS } = require("../utils/common/ENUM");
const { PENDING, REJECTED, VERIFIED } = KYC_STATUS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kycs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(PENDING, REJECTED, VERIFIED),
        defaultValue: PENDING,
        allowNull: false,
      },
      verifiedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
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
    await queryInterface.dropTable("kycs");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_kycs_status";`
    );
  },
};
