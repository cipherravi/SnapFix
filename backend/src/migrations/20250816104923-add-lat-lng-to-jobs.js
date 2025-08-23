"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobs", "lat", {
      type: Sequelize.DECIMAL(10, 6),
      allowNull: true,
    });

    await queryInterface.addColumn("jobs", "lng", {
      type: Sequelize.DECIMAL(10, 6),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobs", "lat");
    await queryInterface.removeColumn("jobs", "lng");
  },
};
