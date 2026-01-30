"use strict";
/** @type {import('sequelize-cli').Migration} */

const { JOB_ASSET_TYPE, JOB_ASSET_POSITION } = require("../utils/common/ENUM");
const { IMAGE, VIDEO } = JOB_ASSET_TYPE;
const { MAIN, SECONDARY, THIRD, THUMBNAIL } = JOB_ASSET_POSITION;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobassets", {
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
      file_type: {
        type: Sequelize.ENUM(IMAGE, VIDEO),
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_position: {
        type: Sequelize.ENUM(MAIN, SECONDARY, THIRD, THUMBNAIL),
        defaultValue: MAIN,
        allowNull: false,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobassets");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobassets_fileType";',
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_jobassets_filePosition";`,
    );
  },
};
