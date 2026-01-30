"use strict";

/** @type {import('sequelize-cli').Migration} */
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER } = ENUM.USER_ROLE;

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
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("reviews", {
      fields: ["reviewer_id", "reviewee_id", "job_id"],
      type: "unique",
      name: "unique_review_per_user_per_job",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reviews",
      "unique_review_per_user_per_job",
    );
    await queryInterface.dropTable("reviews");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reviews_role";',
    );
  },
};
