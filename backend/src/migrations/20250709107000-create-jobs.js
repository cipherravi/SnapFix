"use strict";
/** @type {import('sequelize-cli').Migration} */
const { ENUM } = require("../utils/common");
const {
  INITIATED,
  POSTED,
  ASSIGNED,
  STARTED,
  IN_PROGRESS,
  COMPLETED,
  APPROVED,
  CANCELLED,
} = ENUM.JOB_STATUS;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          INITIATED,
          POSTED,
          ASSIGNED,
          STARTED,
          IN_PROGRESS,
          COMPLETED,
          APPROVED,
          CANCELLED
        ),
        allowNull: false,
        defaultValue: INITIATED,
      },
      budget: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      workerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cities",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      initialAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobs");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobs_status";'
    );
  },
};
