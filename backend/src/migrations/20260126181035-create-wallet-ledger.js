"use strict";
const {
  TRANSACTION_TYPE,
  WALLET_TRANSACTION_PURPOSE,
} = require("../utils/common/ENUM");
const { CREDIT, DEBIT } = TRANSACTION_TYPE;
const { ADJUSTMENT, REFUND } = WALLET_TRANSACTION_PURPOSE;

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
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wallets",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        defaultValue: "INR",
      },
      transaction_type: {
        type: Sequelize.ENUM(CREDIT, DEBIT, REFUND, ADJUSTMENT),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      previous_hash: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      current_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
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

    // High performance analytical indexing for ledger balance verification
    await queryInterface.addIndex("wallet_ledgers", ["wallet_id", "id"], {
      name: "idx_wallet_ledgers_latest",
    });

    // Unique ledger verification tracking mapping for double-entry enforcement
    await queryInterface.addIndex(
      "wallet_ledgers",
      ["wallet_id", "reference_id"],
      {
        unique: true,
        name: "idx_wallet_ledgers_reference_unique",
      },
    );

    // Unique sequential index to prevent race conditions on balance verification chains
    await queryInterface.addIndex("wallet_ledgers", ["wallet_id", "sequence"], {
      unique: true,
      name: "idx_wallet_ledgers_sequence_unique",
    });

    // Relational tracking performance optimization index
    await queryInterface.addIndex("wallet_ledgers", ["user_id"], {
      name: "idx_wallet_ledgers_user_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wallet_ledgers");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_wallet_ledgers_transaction_type" CASCADE;',
    );
  },
};
