"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: "userId", as: "holder" });
      Wallet.hasMany(models.WalletTransaction, {
        foreignKey: "walletId",
        as: "transactions",
      });
      Wallet.hasMany(models.WalletPayment, {
        foreignKey: "walletId",
        as: "payments",
      });
    }
  }
  Wallet.init(
    {
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "wallets",
      timestamps: true,
    }
  );
  return Wallet;
};
