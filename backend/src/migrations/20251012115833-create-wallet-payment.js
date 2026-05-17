"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  WALLET_PAYMENT_PURPOSE,
} = require("../utils/common/ENUM");
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ONLINE } = PAYMENT_METHOD;
const { ADD_BALANCE, WITHDRAWAL, REPAYMENT } = WALLET_PAYMENT_PURPOSE;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallet_payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM(ONLINE),
        allowNull: false,
        defaultValue: ONLINE,
      },
      provider: { type: Sequelize.STRING(50), defaultValue: "razorpay" },
      razorpay_order_id: Sequelize.STRING,
      razorpay_payment_id: Sequelize.STRING,
      razorpay_signature: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: INITIATED,
      },
      purpose: {
        type: Sequelize.ENUM(ADD_BALANCE, WITHDRAWAL, REPAYMENT),
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_purpose";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_method";',
    );
    await queryInterface.dropTable("wallet_payments");
  },
};
