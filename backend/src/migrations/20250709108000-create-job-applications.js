"use strict";
const { ENUM } = require("../utils/common");
const { APPLIED, SELECTED, COMPLETED, REJECTED } = ENUM.JOB_APPLICATION_STATUS;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_applications", {
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
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(APPLIED, SELECTED, COMPLETED, REJECTED),
        allowNull: false,
        defaultValue: APPLIED,
      },
      applied_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      selected_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
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

    // Composite unique index to prevent a worker from applying to the same job twice
    await queryInterface.addIndex("job_applications", ["job_id", "user_id"], {
      name: "idx_job_applications_job_id_user_id_unique",
      unique: true,
    });

    // Standalone performance indexes for fast profile histories and dashboard lookups
    await queryInterface.addIndex("job_applications", ["job_id"], {
      name: "idx_job_applications_job_id",
    });
    await queryInterface.addIndex("job_applications", ["user_id"], {
      name: "idx_job_applications_user_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_applications");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_job_applications_status" CASCADE;',
    );
  },
};
