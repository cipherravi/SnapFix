"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallet_ledgers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
      },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        defaultValue: "INR",
      },
      transaction_type: {
        type: Sequelize.ENUM("credit", "debit", "refund", "adjustment"),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },

      // -- ledger integrity
      previous_hash: { type: Sequelize.STRING(64) },
      current_hash: { type: Sequelize.STRING(64), allowNull: false },

      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("wallet_ledgers", ["wallet_id", "id"], {
      name: "idx_wallet_latest",
    });

    await queryInterface.addIndex(
      "wallet_ledgers",
      ["wallet_id", "reference_id"],
      {
        unique: true,
        name: "uq_wallet_reference",
      },
    );
    await queryInterface.addIndex("wallet_ledgers", ["wallet_id", "sequence"], {
      unique: true,
      name: "uq_wallet_sequence",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("wallet_ledgers", "idx_wallet_latest");
    await queryInterface.removeIndex("wallet_ledgers", "uq_wallet_reference");
    await queryInterface.removeIndex("wallet_ledgers", "uq_wallet_sequence");
    await queryInterface.dropTable("wallet_ledgers");
  },
};
