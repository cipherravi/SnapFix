"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.addColumn("jobs", "addressId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "addresses",
        key: "id",
      },
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("jobs", "address", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     **/
    await queryInterface.removeColumn("jobs", "addressId");
    await queryInterface.removeColumn("jobs", "address");
  },
};
