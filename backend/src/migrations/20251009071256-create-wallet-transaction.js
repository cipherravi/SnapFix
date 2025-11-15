"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
  WALLET_TRANSACTION_STATUS,
  WALLET_TRANSACTION_PURPOSE,
  TRANSACTION_TYPE,
} = require("../utils/common/ENUM");
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } =
  WALLET_TRANSACTION_STATUS;
const {
  JOB_PAYMENT,
  ADD_BALANCE,
  REPAYMENT,
  ADJUSTMENT,
  PENALTY,
  REFUND,
  WITHDRAWAL,
  COMMISION,
} = WALLET_TRANSACTION_PURPOSE;
const { CREDIT, DEBIT } = TRANSACTION_TYPE;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallet_transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      walletId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      transaction_type: {
        type: Sequelize.ENUM(DEBIT, CREDIT),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: PENDING,
        allowNull: false,
      },
      previous_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      new_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      reference: { type: Sequelize.STRING(100), allowNull: true, unique: true },
      purpose: {
        type: Sequelize.ENUM(
          JOB_PAYMENT,
          ADD_BALANCE,
          REPAYMENT,
          ADJUSTMENT,
          PENALTY,
          REFUND,
          WITHDRAWAL,
          COMMISION
        ),
        allowNull: true,
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
    await queryInterface.addConstraint("wallet_transactions", {
      fields: ["reference"],
      type: "unique",
      name: "unique_wallet_transaction_reference",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wallet_transactions");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_transactions_transaction_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_transactions_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_transactions_purpose";'
    );
  },
};
