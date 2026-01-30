"use strict";
const { Model } = require("sequelize");

const {
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  WALLET_PAYMENT_PURPOSE,
} = require("../utils/common/ENUM");
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ONLINE } = PAYMENT_METHOD;
const { ADD_BALANCE, WITHDRAWAL, REPAYMENT } = WALLET_PAYMENT_PURPOSE;

module.exports = (sequelize, DataTypes) => {
  class WalletPayment extends Model {
    static associate(models) {
      WalletPayment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      WalletPayment.belongsTo(models.Wallet, {
        foreignKey: "walletId",
        as: "wallet",
      });
    }
  }
  WalletPayment.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "wallet_id",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      method: {
        type: DataTypes.ENUM(ONLINE),
        allowNull: false,
        defaultValue: ONLINE,
      },
      provider: { type: DataTypes.STRING(50), defaultValue: "razorpay" },
      razorpay_order_id: DataTypes.STRING,
      razorpay_payment_id: DataTypes.STRING,
      razorpay_signature: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: INITIATED,
      },
      purpose: {
        type: DataTypes.ENUM(ADD_BALANCE, WITHDRAWAL, REPAYMENT),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "WalletPayment",
      tableName: "wallet_payments",
      timestamps: true,
      underscored: true,
    },
  );
  return WalletPayment;
};
