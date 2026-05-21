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
        onDelete: "CASCADE",
      });
      WalletPayment.belongsTo(models.Wallet, {
        foreignKey: "walletId",
        as: "wallet",
        onDelete: "CASCADE",
      });
    }
  }

  WalletPayment.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "wallet_id",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM(ONLINE),
        allowNull: false,
        defaultValue: ONLINE,
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "razorpay",
      },
      razorpayOrderId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "razorpay_order_id",
      },
      razorpayPaymentId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "razorpay_payment_id",
      },
      razorpaySignature: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "razorpay_signature",
      },
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        allowNull: false,
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
      underscored: true,
      indexes: [
        {
          name: "idx_wallet_payments_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_wallet_payments_wallet_id",
          fields: ["wallet_id"],
        },
        {
          name: "idx_wallet_payments_razorpay_order_id",
          fields: ["razorpay_order_id"],
        },
      ],
    },
  );

  return WalletPayment;
};
