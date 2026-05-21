"use strict";
const { KYC_STATUS } = require("../utils/common/ENUM");
const { PENDING, REJECTED, VERIFIED } = KYC_STATUS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kycs", {
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
      },
      status: {
        type: Sequelize.ENUM(PENDING, REJECTED, VERIFIED),
        defaultValue: PENDING,
        allowNull: false,
      },
      verified_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
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

    // 1-to-1 Profile mapping constraint enforced via unique index tracking
    await queryInterface.addIndex("kycs", ["user_id"], {
      name: "idx_kycs_user_id_unique",
      unique: true,
    });

    // Relational performance index for internal admin audits and verification loops
    await queryInterface.addIndex("kycs", ["verified_by"], {
      name: "idx_kycs_verified_by",
    });

    // Filtering optimization index for admin dashboard pipeline views
    await queryInterface.addIndex("kycs", ["status"], {
      name: "idx_kycs_status",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kycs");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_kycs_status" CASCADE;',
    );
  },
};
