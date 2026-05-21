"use strict";
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
  EXPIRED,
} = ENUM.JOB_STATUS;

/** @type {import('sequelize-cli').Migration} */
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
          CANCELLED,
          EXPIRED,
        ),
        allowNull: false,
        defaultValue: INITIATED,
      },
      budget: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      worker_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "cities",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      initial_address: {
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

    await queryInterface.addIndex("jobs", ["user_id"], {
      name: "idx_jobs_user_id",
    });
    await queryInterface.addIndex("jobs", ["worker_id"], {
      name: "idx_jobs_worker_id",
    });
    await queryInterface.addIndex("jobs", ["category_id"], {
      name: "idx_jobs_category_id",
    });
    await queryInterface.addIndex("jobs", ["city_id"], {
      name: "idx_jobs_city_id",
    });
    await queryInterface.addIndex("jobs", ["address_id"], {
      name: "idx_jobs_address_id",
    });

    await queryInterface.addIndex("jobs", ["status"], {
      name: "idx_jobs_status",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobs");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobs_status" CASCADE;',
    );
  },
};
