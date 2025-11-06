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
        unique: true,
        allowNull: false,
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
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_users_role";
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_users_gender";
  `);
  },
};
