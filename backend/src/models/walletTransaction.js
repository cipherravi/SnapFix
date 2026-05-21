"use strict";
const { Model } = require("sequelize");
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

module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    static associate(models) {
      WalletTransaction.belongsTo(models.Wallet, {
        foreignKey: "walletId",
        as: "wallet",
        onDelete: "CASCADE",
      });
    }
  }

  WalletTransaction.init(
    {
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "wallet_id",
      },
      transactionType: {
        type: DataTypes.ENUM(CREDIT, DEBIT),
        allowNull: false,
        field: "transaction_type",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: PENDING,
        allowNull: false,
      },
      previousBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "previous_balance",
      },
      newBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "new_balance",
      },
      reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      purpose: {
        type: DataTypes.ENUM(
          JOB_PAYMENT,
          ADD_BALANCE,
          ADJUSTMENT,
          REPAYMENT,
          PENALTY,
          REFUND,
          WITHDRAWAL,
          COMMISION,
        ),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "WalletTransaction",
      tableName: "wallet_transactions",
      underscored: true,
      indexes: [
        {
          name: "idx_wallet_transactions_reference_unique",
          unique: true,
          fields: ["reference"],
        },
        {
          name: "idx_wallet_transactions_wallet_id",
          fields: ["wallet_id"],
        },
        {
          name: "idx_wallet_transactions_status",
          fields: ["status"],
        },
      ],
    },
  );

  return WalletTransaction;
};
