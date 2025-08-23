"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Plumbing",
        description: "Fix leaks, pipe installation, drainage issues",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Electrician",
        description: "Electrical wiring, fan/AC repairs, installations",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Home Cleaning",
        description: "House cleaning, deep cleaning, kitchen/bathroom cleaning",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "AC Repair",
        description: "Air conditioner repair and servicing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Painter",
        description: "Wall painting, furniture painting, touch-ups",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Furniture Assembly",
        description: "IKEA/furniture installation and repairs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delivery & Pickup",
        description: "Pick and drop documents, items, etc.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gardening",
        description: "Plant care, landscaping, lawn mowing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Carpentry",
        description: "Woodwork, furniture repair and making",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mobile Repair",
        description: "Phone screen, battery, software fixes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Computer Help",
        description: "PC repair, virus removal, formatting, software install",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tutoring",
        description: "Home tutoring for any subject/class",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "CCTV Installation",
        description: "Surveillance camera setup and repair",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cooking Help",
        description: "Part-time cooking or meal preparation",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Baby Sitting",
        description: "Childcare help at home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
