"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ATTEMPT_STATUS,
} = require("../utils/common/ENUM");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },

        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: "INR",
      },
      method: {
        type: Sequelize.ENUM(ONLINE, WALLET, COD),
        allowNull: false,
      },
      razorpay_order_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      razorpay_payment_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      razorpay_signature: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      txn_reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "razorpay",
      },

      status: {
        type: Sequelize.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: INITIATED,
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      refund_reference: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      attempt_status: {
        type: Sequelize.ENUM(ACTIVE, ABANDONED),
        defaultValue: ACTIVE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_method";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_status";'
    );
  },
};
