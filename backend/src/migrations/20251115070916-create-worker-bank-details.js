"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("worker_bank_details", {
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
      account_holder: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ifsc: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // Unique verification index mapping for fraud prevention and tracking
    await queryInterface.addIndex("worker_bank_details", ["account_number"], {
      name: "idx_worker_bank_details_account_number_unique",
      unique: true,
    });

    // Relational optimization index for worker profile management pipelines
    await queryInterface.addIndex("worker_bank_details", ["user_id"], {
      name: "idx_worker_bank_details_user_id",
    });

    // Filtering index optimization for settlement engine lookup distributions
    await queryInterface.addIndex(
      "worker_bank_details",
      ["is_active", "is_primary"],
      {
        name: "idx_worker_bank_details_active_primary",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("worker_bank_details");
  },
};
