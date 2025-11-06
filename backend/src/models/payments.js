"use strict";
const { Model } = require("sequelize");
const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ATTEMPT_STATUS,
} = require("../utils/common/ENUM");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Payment.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
      });
    }
  }
  Payment.init(
    {
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING(10), defaultValue: "INR" },
      method: DataTypes.ENUM(ONLINE, WALLET, COD),
      razorpay_order_id: { type: DataTypes.STRING(100), allowNull: true },
      razorpay_payment_id: { type: DataTypes.STRING(100), allowNull: true },
      razorpay_signature: { type: DataTypes.STRING(255), allowNull: true },
      txn_reference: { type: DataTypes.STRING, allowNull: true },
      provider: {
        type: DataTypes.STRING(50),
        defaultValue: "razorpay",
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        defaultValue: INITIATED,
      },
      refund_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      refund_reference: { type: DataTypes.STRING(100), allowNull: true },
      attempt_status: {
        type: DataTypes.ENUM(ACTIVE, ABANDONED),
        defaultValue: ACTIVE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
    }
  );
  return Payment;
};
