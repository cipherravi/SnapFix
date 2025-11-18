"use strict";
/** @type {import('sequelize-cli').Migration} */
const { WITHDRAW_REQUEST_STATUS } = require("../utils/common/ENUM");
const { PENDING, PROCESSING, PAID, REJECTED } = WITHDRAW_REQUEST_STATUS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("withdraw_requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      bank_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "worker_bank_details", key: "id" },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(PENDING, PROCESSING, PAID, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
      },
      paid_at: {
        type: Sequelize.DATE,
      },
      utr_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      paid_by: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      remark: {
        type: Sequelize.STRING,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("withdraw_requests");
  },
};
