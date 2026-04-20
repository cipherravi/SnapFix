"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "charges_master",
      [
        {
          name: "COD fee",
          type: "fixed",
          value: 30.0,
          applicable_methods: "cod",
          apply_on: "base",
          is_gross_up: false,
          priority: 5,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Payment Gateway fee",
          type: "percentage",
          value: 2.0,
          applicable_methods: "online",
          apply_on: "subtotal",
          is_gross_up: true,
          priority: 99,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Extra handling fee",
          type: "percentage",
          value: 2.0,
          applicable_methods: "cod",
          apply_on: "subtotal",
          is_gross_up: true,
          priority: 90,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Platform fee",
          type: "fixed",
          value: 10.0,
          applicable_methods: "all",
          apply_on: "base",
          is_gross_up: false,
          priority: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("charges_master", null, {});
  },
};
