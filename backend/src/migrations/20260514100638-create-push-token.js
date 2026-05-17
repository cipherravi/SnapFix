"use strict";
const { ENUM } = require("../utils/common");
const { PLATFORM_TYPE } = ENUM;
const { ANDROID, IOS, WEB } = PLATFORM_TYPE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("push_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      platform: {
        type: Sequelize.ENUM(ANDROID, IOS, WEB),
        allowNull: false,
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      app_version: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      last_used_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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

    await queryInterface.addConstraint("push_tokens", {
      fields: ["user_id", "token"],
      type: "unique",
      name: "unique_user_token_combination",
    });
    await queryInterface.addIndex("push_tokens", ["user_id"], {
      name: "idx_push_tokens_user_id",
    });
    await queryInterface.addIndex("push_tokens", ["token"], {
      name: "idx_push_tokens_active_only",
      where: { is_active: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("push_tokens");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_push_tokens_platform";',
    );
  },
};
