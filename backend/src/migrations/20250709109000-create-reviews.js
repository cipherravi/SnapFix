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
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      reviewerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      revieweeId: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("reviews", {
      fields: ["reviewerId", "revieweeId", "jobId"],
      type: "unique",
      name: "unique_review_per_user_per_job",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reviews",
      "unique_review_per_user_per_job"
    );
    await queryInterface.dropTable("reviews");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reviews_role";'
    );
  },
};
