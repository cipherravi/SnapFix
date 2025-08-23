"use strict";
/** @type {import('sequelize-cli').Migration} */
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER, MODERATOR, ADMIN, AGENT } = ENUM.USER_ROLE;
const { MALE, FEMALE } = ENUM.USER_GENDER;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      dateOfBirth: { type: Sequelize.DATE, allowNull: true },
      gender: {
        type: Sequelize.ENUM(MALE, FEMALE),
        allowNull: true,
      },
      profilePicUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM(CLIENT, WORKER, MODERATOR, ADMIN, AGENT),
        allowNull: false,
        defaultValue: CLIENT,
      },
      cityId: {
        type: Sequelize.INTEGER,
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

    // ✅ Partial unique index for email (PostgreSQL)
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_users_email ON "users"(email) WHERE email IS NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS unique_users_email;
  `);

    await queryInterface.dropTable("users");
  },
};
