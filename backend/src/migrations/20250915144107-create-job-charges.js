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
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      chargeId: {
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

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add composite unique constraint
    await queryInterface.addConstraint("job_charges", {
      fields: ["jobId", "chargeId"],
      type: "unique",
      name: "unique_job_charge",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_charges");
  },
};
