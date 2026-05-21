"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: "userId",
        as: "holder",
        onDelete: "CASCADE",
      });
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
        defaultValue: 0.0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "wallets",
      underscored: true,
      indexes: [
        {
          name: "idx_wallets_user_id_unique",
          unique: true,
          fields: ["user_id"],
        },
      ],
    },
  );

  return Wallet;
};
