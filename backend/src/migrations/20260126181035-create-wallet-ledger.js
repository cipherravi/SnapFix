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
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // composite index on user_id and wallet_id
    await queryInterface.addIndex("wallet_ledgers", ["user_id", "wallet_id"], {
      name: "idx_user_wallet",
    });

    //Reference index
    await queryInterface.addIndex("wallet_ledgers", ["reference_id"], {
      name: "idx_reference",
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("wallet_ledgers", "idx_user_wallet");
    await queryInterface.removeIndex("wallet_ledgers", "idx_reference");
    await queryInterface.removeIndex("wallet_ledgers", "idx_wallet_latest");
    await queryInterface.removeIndex("wallet_ledgers", "uq_wallet_reference");
    await queryInterface.dropTable("wallet_ledgers");
  },
};
