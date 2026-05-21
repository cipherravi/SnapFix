"use strict";
const { WITHDRAW_REQUEST_STATUS } = require("../utils/common/ENUM");
const { PENDING, PROCESSING, PAID, REJECTED, CANCELLED } =
  WITHDRAW_REQUEST_STATUS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("withdraw_requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      bank_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "worker_bank_details",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(PENDING, PROCESSING, PAID, REJECTED, CANCELLED),
        defaultValue: PENDING,
        allowNull: false,
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      utr_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      paid_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      remark: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Unique tracking verification index mapping for single disbursement confirmation rules
    await queryInterface.addIndex("withdraw_requests", ["utr_id"], {
      name: "idx_withdraw_requests_utr_id_unique",
      unique: true,
    });

    // Relational optimization metrics indexing arrays
    await queryInterface.addIndex("withdraw_requests", ["user_id"], {
      name: "idx_withdraw_requests_user_id",
    });
    await queryInterface.addIndex("withdraw_requests", ["bank_detail_id"], {
      name: "idx_withdraw_requests_bank_detail_id",
    });

    // Filtering index optimization for dashboard financial ledger sweeps
    await queryInterface.addIndex("withdraw_requests", ["status"], {
      name: "idx_withdraw_requests_status",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("withdraw_requests");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_withdraw_requests_status" CASCADE;',
    );
  },
};
