"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Job, {
        foreignKey: "categoryId",
        as: "jobs",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 30] },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [1, 50] },
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      underscored: true,
      indexes: [
        {
          name: "idx_categories_name_unique",
          unique: true,
          fields: ["name"],
        },
      ],
    },
  );

  return Category;
};
