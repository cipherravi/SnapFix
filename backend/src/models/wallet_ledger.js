"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class wallet_ledger extends Model {
    static associate(models) {
      // Optional associations
      // wallet_ledger.belongsTo(models.user, { foreignKey: 'user_id' });
      // wallet_ledger.belongsTo(models.wallet, { foreignKey: 'wallet_id' });
    }
  }

  wallet_ledger.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

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

      currency: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: "INR",
      },

      transaction_type: {
        type: DataTypes.ENUM("credit", "debit", "refund", "adjustment"),
        allowNull: false,
      },

      reference_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      previous_hash: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },

      current_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "wallet_ledger",
      tableName: "wallet_ledgers",
      timestamps: false, // only created_at exists
      underscored: true,
    },
  );

  return wallet_ledger;
};
