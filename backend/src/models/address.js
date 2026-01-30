"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Address.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
      Address.belongsTo(models.City, { foreignKey: "cityId", as: "city" });
      Address.hasMany(models.Job, { foreignKey: "addressId", as: "jobs" });
    }
  }
  Address.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
        field: "user_id",
      },
      building: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 30] },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [1, 30] },
      },
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
        },
        field: "area_id",
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
        field: "city_id",
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: "is_primary",
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "addresses",
      timestamps: true,
      underscored: true,
    },
  );
  return Address;
};
