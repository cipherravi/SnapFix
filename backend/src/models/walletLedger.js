"use strict";
const { Model } = require("sequelize");
const {
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_PURPOSE,
} = require("../utils/common/ENUM");
const { CREDIT, DEBIT } = TRANSACTION_TYPE;
const { ADJUSTMENT, REFUND } = WALLET_TRANSACTION_PURPOSE;

module.exports = (sequelize, DataTypes) => {
  class WalletLedger extends Model {
    static associate(models) {
      WalletLedger.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
      WalletLedger.belongsTo(models.Wallet, {
        foreignKey: "walletId",
        as: "wallet",
        onDelete: "CASCADE",
      });
    }
  }

  WalletLedger.init(
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
      transactionType: {
        type: DataTypes.ENUM(CREDIT, DEBIT, REFUND, ADJUSTMENT),
        allowNull: false,
        field: "transaction_type",
      },
      referenceId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: "reference_id",
      },
      previousHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: "previous_hash",
      },
      currentHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: "current_hash",
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      modelName: "WalletLedger",
      tableName: "wallet_ledgers",
      timestamps: false, // Explicitly false since only created_at is captured
      underscored: true,
      indexes: [
        {
          name: "idx_wallet_ledgers_latest",
          fields: ["wallet_id", "id"],
        },
        {
          name: "idx_wallet_ledgers_reference_unique",
          unique: true,
          fields: ["wallet_id", "reference_id"],
        },
        {
          name: "idx_wallet_ledgers_sequence_unique",
          unique: true,
          fields: ["wallet_id", "sequence"],
        },
        {
          name: "idx_wallet_ledgers_user_id",
          fields: ["user_id"],
        },
      ],
    },
  );

  return WalletLedger;
};
