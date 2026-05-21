"use strict";
const { Model } = require("sequelize");
const { WITHDRAW_REQUEST_STATUS } = require("../utils/common/ENUM");
const { PENDING, PROCESSING, PAID, REJECTED, CANCELLED } =
  WITHDRAW_REQUEST_STATUS;

module.exports = (sequelize, DataTypes) => {
  class WithdrawRequest extends Model {
    static associate(models) {
      WithdrawRequest.belongsTo(models.User, {
        foreignKey: "userId",
        as: "requester",
        onDelete: "CASCADE",
      });
      WithdrawRequest.belongsTo(models.WorkerBankDetail, {
        foreignKey: "bankDetailId",
        as: "bankDetail",
        onDelete: "CASCADE",
      });
      WithdrawRequest.belongsTo(models.User, {
        foreignKey: "paidBy",
        as: "approver",
        onDelete: "SET NULL",
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
        validate: {
          min: 100,
          max: 10000,
        },
      },
      status: {
        type: DataTypes.ENUM(PENDING, PROCESSING, PAID, REJECTED, CANCELLED),
        defaultValue: PENDING,
        allowNull: false,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "paid_at",
      },
      utrId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "utr_id",
      },
      paidBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "paid_by",
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "remark",
      },
    },
    {
      sequelize,
      modelName: "WithdrawRequest",
      tableName: "withdraw_requests",
      underscored: true,
      indexes: [
        {
          name: "idx_withdraw_requests_utr_id_unique",
          unique: true,
          fields: ["utr_id"],
        },
        {
          name: "idx_withdraw_requests_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_withdraw_requests_bank_detail_id",
          fields: ["bank_detail_id"],
        },
        {
          name: "idx_withdraw_requests_status",
          fields: ["status"],
        },
      ],
    },
  );

  return WithdrawRequest;
};
