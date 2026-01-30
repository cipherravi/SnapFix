"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      Area.belongsTo(models.City, { foreignKey: "cityId", as: "city" });
      Area.hasMany(models.Address, { foreignKey: "areaId", as: "addresses" });
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
      cityId: { type: DataTypes.INTEGER, allowNull: false, field: "city_id" },
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
      timestamps: true,
      underscored: true,
    },
  );
  return Area;
};
