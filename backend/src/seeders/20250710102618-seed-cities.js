"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("cities", [
      {
        name: "Patna",
        state: "Bihar",
        pincode: "800001",
        latitude: 25.5941,
        longitude: 85.1376,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delhi",
        state: "Delhi",
        pincode: "110001",
        latitude: 28.6139,
        longitude: 77.209,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        latitude: 19.076,
        longitude: 72.8777,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        latitude: 12.9716,
        longitude: 77.5946,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kolkata",
        state: "West Bengal",
        pincode: "700001",
        latitude: 22.5726,
        longitude: 88.3639,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        latitude: 17.385,
        longitude: 78.4867,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        latitude: 23.0225,
        longitude: 72.5714,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        latitude: 18.5204,
        longitude: 73.8567,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001",
        latitude: 26.8467,
        longitude: 80.9462,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jaipur",
        state: "Rajasthan",
        pincode: "302001",
        latitude: 26.9124,
        longitude: 75.7873,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cities", null, {});
  },
};
