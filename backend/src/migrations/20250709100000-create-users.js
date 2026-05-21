"use strict";
const { ENUM } = require("../utils/common");
const { CLIENT, WORKER, MODERATOR, ADMIN, AGENT } = ENUM.USER_ROLE;
const { MALE, FEMALE } = ENUM.USER_GENDER;

/** @type {import('sequelize-cli').Migration} */
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
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM(MALE, FEMALE),
        allowNull: true,
      },
      profile_pic_url: {
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

    await queryInterface.addIndex("users", ["email"], {
      name: "idx_users_email_unique",
      unique: true,
    });
    await queryInterface.addIndex("users", ["phone"], {
      name: "idx_users_phone_unique",
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_gender" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role" CASCADE;',
    );
  },
};
