"use strict";
const { Model } = require("sequelize");
const { WITHDRAW_REQUEST_STATUS } = require("../utils/common/ENUM");
const { PENDING, PROCESSING, PAID, REJECTED } = WITHDRAW_REQUEST_STATUS;
module.exports = (sequelize, DataTypes) => {
  class WithdrawRequest extends Model {
    static associate(models) {
      WithdrawRequest.belongsTo(models.User, {
        foreignKey: "userId",
        as: "requester",
      });
      WithdrawRequest.belongsTo(models.WorkerBankDetail, {
        foreignKey: "bankDetailId",
        as: "bankDetail",
      });
      WithdrawRequest.belongsTo(models.User, {
        foreignKey: "paidBy",
        as: "approver",
      });
    }
  }
  WithdrawRequest.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      bankDetailId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "bank_detail_id",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 100, max: 10000 },
        field: "amount",
      },
      status: {
        type: DataTypes.ENUM(PENDING, PROCESSING, PAID, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
        field: "status",
      },
      paidAt: { type: DataTypes.DATE, field: "paid_at" },
      utrId: { type: DataTypes.STRING(50), unique: true, field: "utr_id" },
      paidBy: { type: DataTypes.INTEGER, field: "paid_by" },
      remark: { type: DataTypes.STRING(100), field: "remark" },
    },
    {
      sequelize,
      tableName: "withdraw_requests",
      modelName: "WithdrawRequest",
      underscored: true,
    }
  );
  return WithdrawRequest;
};
