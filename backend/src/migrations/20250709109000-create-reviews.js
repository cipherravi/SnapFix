"use strict";
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER } = ENUM.USER_ROLE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
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
      reviewer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      reviewee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM(CLIENT, WORKER),
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
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

    // Composite unique index to prevent duplicate reviews for the exact same transaction path
    await queryInterface.addIndex(
      "reviews",
      ["reviewer_id", "reviewee_id", "job_id"],
      {
        name: "idx_reviews_reviewer_id_reviewee_id_job_id_unique",
        unique: true,
      },
    );

    await queryInterface.addIndex("reviews", ["reviewer_id"], {
      name: "idx_reviews_reviewer_id",
    });
    await queryInterface.addIndex("reviews", ["reviewee_id"], {
      name: "idx_reviews_reviewee_id",
    });
    await queryInterface.addIndex("reviews", ["job_id"], {
      name: "idx_reviews_job_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reviews");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reviews_role" CASCADE;',
    );
  },
};
