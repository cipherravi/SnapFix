"use strict";
const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ATTEMPT_STATUS,
} = require("../utils/common/ENUM");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;
const { ACTIVE, ABANDONED } = ATTEMPT_STATUS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: "INR",
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM(ONLINE, WALLET, COD),
        allowNull: false,
      },
      razorpay_order_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      razorpay_payment_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      razorpay_signature: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      txn_reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "razorpay",
      },
      status: {
        type: Sequelize.ENUM(INITIATED, PENDING, SUCCESS, FAILED, REFUNDED),
        allowNull: false,
        defaultValue: INITIATED,
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      refund_reference: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      attempt_status: {
        type: Sequelize.ENUM(ACTIVE, ABANDONED),
        defaultValue: ACTIVE,
        allowNull: false,
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

    // Foreign key structural lookup optimization indexes
    await queryInterface.addIndex("payments", ["job_id"], {
      name: "idx_payments_job_id",
    });
    await queryInterface.addIndex("payments", ["user_id"], {
      name: "idx_payments_user_id",
    });

    // High performance idempotent webhook and settlement matching indexes
    await queryInterface.addIndex("payments", ["razorpay_order_id"], {
      name: "idx_payments_razorpay_order_id",
    });
    await queryInterface.addIndex("payments", ["txn_reference"], {
      name: "idx_payments_txn_reference",
    });
    await queryInterface.addIndex("payments", ["status"], {
      name: "idx_payments_status",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_method" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_status" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_attempt_status" CASCADE;',
    );
  },
};
