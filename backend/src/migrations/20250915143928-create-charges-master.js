"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
  CHARGES_APPLICABLE,
  CHARGES_TYPE,
  CHARGES_APPLY_ON,
} = require("../utils/common/ENUM");
const { ALL, COD, ONLINE, WALLET } = CHARGES_APPLICABLE;
const { FIXED, PERCENTAGE } = CHARGES_TYPE;
const { BASE, SUBTOTAL } = CHARGES_APPLY_ON;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("charges_master", {
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
      type: {
        type: Sequelize.ENUM(FIXED, PERCENTAGE),
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
      },
      applicable_methods: {
        type: Sequelize.ENUM(ONLINE, WALLET, COD, ALL),
        defaultValue: ALL,
        allowNull: false,
      },
      apply_on: {
        type: Sequelize.ENUM(BASE, SUBTOTAL),
      },
      is_gross_up: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      priority: { type: Sequelize.INTEGER, allowNull: false },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable("charges_master");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_applicable_methods";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_apply_on";'
    );
  },
};
