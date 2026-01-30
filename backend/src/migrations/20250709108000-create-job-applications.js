"use strict";
/** @type {import('sequelize-cli').Migration} */
const { ENUM } = require("../utils/common");
const { APPLIED, SELECTED, COMPLETED, REJECTED } = ENUM.JOB_APPLICATION_STATUS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobapplications", {
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
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("jobapplications", {
      fields: ["job_id", "user_id"],
      type: "unique",
      name: "unique_job_user_pair",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "jobapplications",
      "unique_job_user_pair",
    );

    await queryInterface.dropTable("jobapplications");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobapplications_status";',
    );
  },
};
