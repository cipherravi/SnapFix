"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkerBankDetail extends Model {
    static associate(models) {
      WorkerBankDetail.belongsTo(models.User, {
        foreignKey: "userId",
        as: "bankDetail",
        onDelete: "CASCADE",
      });
      WorkerBankDetail.hasMany(models.WithdrawRequest, {
        foreignKey: "bankDetailId",
        as: "withdrawRequests",
      });
    }
  }

  WorkerBankDetail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      accountHolder: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: "account_holder",
        validate: {
          len: [3, 30],
        },
      },
      accountNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: "account_number",
        validate: {
          len: [9, 30],
          isNumeric: true,
        },
      },
      bankName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "bank_name",
        validate: {
          len: [2, 50],
        },
      },
      ifsc: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: "ifsc",
        validate: {
          is: /^[A-Z]{4}0[A-Z0-9]{6}$/i,
        },
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_primary",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      sequelize,
      modelName: "WorkerBankDetail",
      tableName: "worker_bank_details",
      underscored: true,
      indexes: [
        {
          name: "idx_worker_bank_details_account_number_unique",
          unique: true,
          fields: ["account_number"],
        },
        {
          name: "idx_worker_bank_details_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_worker_bank_details_active_primary",
          fields: ["is_active", "is_primary"],
        },
      ],
    },
  );

  return WorkerBankDetail;
};
