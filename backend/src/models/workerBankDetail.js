"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkerBankDetail extends Model {
    static associate(models) {
      WorkerBankDetail.belongsTo(models.User, {
        foreignKey: "userId",
        as: "bankDetail",
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
        validate: { len: [5, 30] },
        field: "account_holder",
      },

      accountNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: { len: [10, 30], isNumeric: true },
        field: "account_number",
      },

      bankName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { len: [10, 50] },
        field: "bank_name",
      },

      ifsc: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          is: /^[A-Z]{4}0[A-Z0-9]{6}$/i,
        },
        field: "ifsc",
      },

      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_primary",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      sequelize,
      modelName: "WorkerBankDetail",
      tableName: "worker_bank_details",
      underscored: true,
    }
  );

  return WorkerBankDetail;
};
