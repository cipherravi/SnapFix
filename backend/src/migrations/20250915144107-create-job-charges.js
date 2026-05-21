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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Composite unique index to avoid calculating the same structural fee on a single job twice
    await queryInterface.addIndex("job_charges", ["job_id", "charge_id"], {
      name: "idx_job_charges_job_id_charge_id_unique",
      unique: true,
    });

    // Relational sorting lookups for real-time breakdowns during invoicing pipelines
    await queryInterface.addIndex("job_charges", ["job_id"], {
      name: "idx_job_charges_job_id",
    });
    await queryInterface.addIndex("job_charges", ["charge_id"], {
      name: "idx_job_charges_charge_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_charges");
  },
};
