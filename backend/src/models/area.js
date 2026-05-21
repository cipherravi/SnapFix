"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      Area.belongsTo(models.City, {
        foreignKey: "cityId",
        as: "city",
        onDelete: "CASCADE",
      });
      Area.hasMany(models.Address, {
        foreignKey: "areaId",
        as: "addresses",
      });
    }
  }

  Area.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 30],
        },
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "city_id",
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
      modelName: "Area",
      tableName: "areas",
      underscored: true,
      indexes: [
        {
          name: "idx_areas_city_id",
          fields: ["city_id"],
        },
        {
          name: "idx_areas_city_id_name",
          fields: ["city_id", "name"],
        },
      ],
    },
  );

  return Area;
};
