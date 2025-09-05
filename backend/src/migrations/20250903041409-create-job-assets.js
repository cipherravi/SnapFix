"use strict";
/** @type {import('sequelize-cli').Migration} */

const { JOB_ASSET_TYPE, JOB_ASSET_POSITION } = require("../utils/common/ENUM");
const { IMAGE, VIDEO } = JOB_ASSET_TYPE;
const { MAIN, SECONDARY, THIRD } = JOB_ASSET_POSITION;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobassets", {
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
      fileType: {
        type: Sequelize.ENUM(IMAGE, VIDEO),
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filePosition: {
        type: Sequelize.ENUM(MAIN, SECONDARY, THIRD),
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
    await queryInterface.dropTable("jobassets");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobassets_fileType";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobassets_filePosition";'
    );
  },
};
