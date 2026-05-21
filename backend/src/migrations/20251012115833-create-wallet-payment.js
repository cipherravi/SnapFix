"use strict";
const {
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  WALLET_PAYMENT_PURPOSE,
} = require("../utils/common/ENUM");
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ONLINE } = PAYMENT_METHOD;
const { ADD_BALANCE, WITHDRAWAL, REPAYMENT } = WALLET_PAYMENT_PURPOSE;

/** @type {import('sequelize-cli').Migration} */
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "razorpay",
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
      status: {
        type: Sequelize.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        allowNull: false,
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

    await queryInterface.addIndex("wallet_payments", ["user_id"], {
      name: "idx_wallet_payments_user_id",
    });
    await queryInterface.addIndex("wallet_payments", ["wallet_id"], {
      name: "idx_wallet_payments_wallet_id",
    });

    // High performance order mapping index for payment webhook handlers
    await queryInterface.addIndex("wallet_payments", ["razorpay_order_id"], {
      name: "idx_wallet_payments_razorpay_order_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wallet_payments");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_status" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_purpose" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_payments_method" CASCADE;',
    );
  },
};
