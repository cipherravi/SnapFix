"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_charges", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      charge_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "charges_master",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
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

    // Add composite unique constraint
    await queryInterface.addConstraint("job_charges", {
      fields: ["job_id", "charge_id"],
      type: "unique",
      name: "unique_job_charge",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_charges");
  },
};
