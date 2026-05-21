"use strict";
const {
  CHARGES_APPLICABLE,
  CHARGES_TYPE,
  CHARGES_APPLY_ON,
} = require("../utils/common/ENUM");
const { ALL, COD, ONLINE, WALLET } = CHARGES_APPLICABLE;
const { FIXED, PERCENTAGE } = CHARGES_TYPE;
const { BASE, SUBTOTAL } = CHARGES_APPLY_ON;

/** @type {import('sequelize-cli').Migration} */
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
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      applicable_methods: {
        type: Sequelize.ENUM(ONLINE, WALLET, COD, ALL),
        defaultValue: ALL,
        allowNull: false,
      },
      apply_on: {
        type: Sequelize.ENUM(BASE, SUBTOTAL),
        allowNull: false,
      },
      is_gross_up: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // Performance sorting index for operational sequencing pipelines
    await queryInterface.addIndex("charges_master", ["priority"], {
      name: "idx_charges_master_priority",
    });

    // Filtering optimization index for isolated active engine loops
    await queryInterface.addIndex("charges_master", ["is_active"], {
      name: "idx_charges_master_is_active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("charges_master");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_type" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_applicable_methods" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_charges_master_apply_on" CASCADE;',
    );
  },
};
