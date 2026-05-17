"use strict";
const { Model } = require("sequelize");
const { ENUM } = require("../utils/common");
const { PLATFORM_TYPE } = ENUM;
const { ANDROID, IOS, WEB } = PLATFORM_TYPE;

module.exports = (sequelize, DataTypes) => {
  class PushToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mapping to the 'users' table via 'user_id'
      PushToken.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  PushToken.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id", // Maps camelCase property to snake_case column
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      platform: {
        type: DataTypes.ENUM(ANDROID, IOS, WEB),
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "device_id",
      },
      appVersion: {
        type: DataTypes.STRING,
        field: "app_version",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "last_used_at",
      },
    },
    {
      sequelize,
      modelName: "PushToken",
      tableName: "push_tokens",
      underscored: true,
      indexes: [
        {
          name: "unique_user_token_combination",
          unique: true,
          fields: ["user_id", "token"],
        },
        {
          name: "idx_push_tokens_user_id",
          fields: ["user_id"],
        },
        {
          name: "idx_push_tokens_active_only",
          fields: ["token"],
          where: {
            is_active: true,
          },
        },
      ],
    },
  );

  return PushToken;
};
