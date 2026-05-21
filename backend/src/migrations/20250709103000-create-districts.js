"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("districts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "states",
          key: "id",
        },
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("districts", ["name"], {
      name: "idx_districts_name_unique",
      unique: true,
    });

    await queryInterface.addIndex("districts", ["state_id"], {
      name: "idx_districts_state_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("districts");
  },
};
