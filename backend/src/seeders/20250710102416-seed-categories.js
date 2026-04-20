"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Plumbing",
        description: "Fix leaks, pipe installation, drainage issues",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Electrician",
        description: "Electrical wiring, fan/AC repairs, installations",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Home Cleaning",
        description: "House cleaning, deep cleaning, kitchen/bathroom cleaning",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "AC Repair",
        description: "Air conditioner repair and servicing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Painter",
        description: "Wall painting, furniture painting, touch-ups",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Furniture Assembly",
        description: "IKEA/furniture installation and repairs",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delivery & Pickup",
        description: "Pick and drop documents, items, etc.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Gardening",
        description: "Plant care, landscaping, lawn mowing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Carpentry",
        description: "Woodwork, furniture repair and making",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mobile Repair",
        description: "Phone screen, battery, software fixes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Computer Help",
        description: "PC repair, virus removal, formatting, software install",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Tutoring",
        description: "Home tutoring for any subject/class",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "CCTV Installation",
        description: "Surveillance camera setup and repair",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Cooking Help",
        description: "Part-time cooking or meal preparation",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Baby Sitting",
        description: "Childcare help at home",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
