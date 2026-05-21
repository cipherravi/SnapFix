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
        onDelete: "CASCADE",
      });
      Payment.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
    }
  }

  Payment.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "INR",
      },
      method: {
        type: DataTypes.ENUM(ONLINE, WALLET, COD),
        allowNull: false,
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
      txnReference: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "txn_reference",
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "razorpay",
      },
      status: {
        type: DataTypes.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        allowNull: false,
        defaultValue: INITIATED,
      },
      refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        field: "refund_amount",
      },
      refundReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "refund_reference",
      },
      attemptStatus: {
        type: DataTypes.ENUM(ACTIVE, ABANDONED),
        allowNull: false,
        defaultValue: ACTIVE,
        field: "attempt_status",
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      underscored: true,
      indexes: [
        {
          name: "idx_payments_job_id",
          fields: ["job_id"],
        },
        {
          name: "idx_payments_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_payments_razorpay_order_id",
          fields: ["razorpay_order_id"],
        },
        {
          name: "idx_payments_txn_reference",
          fields: ["txn_reference"],
        },
        {
          name: "idx_payments_status",
          fields: ["status"],
        },
      ],
    },
  );

  return Payment;
};
