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
      transaction_type: {
        type: DataTypes.ENUM(CREDIT, DEBIT),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: PENDING,
        allowNull: false,
      },
      previous_balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      new_balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      reference: { type: DataTypes.STRING(100), allowNull: true, unique: true },
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
      timestamps: true,
      underscored: true,
    },
  );
  return WalletTransaction;
};
