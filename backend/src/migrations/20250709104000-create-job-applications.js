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
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(APPLIED, SELECTED, COMPLETED, REJECTED),
        allowNull: false,
        defaultValue: APPLIED,
      },
      appliedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("jobapplications", {
      fields: ["jobId", "userId"],
      type: "unique",
      name: "unique_job_user_pair",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "jobapplications",
      "unique_job_user_pair"
    );

    await queryInterface.dropTable("jobapplications");
  },
};
