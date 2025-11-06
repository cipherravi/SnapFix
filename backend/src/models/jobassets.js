"use strict";
const { Model } = require("sequelize");

const { JOB_ASSET_TYPE, JOB_ASSET_POSITION } = require("../utils/common/ENUM");
const { IMAGE, VIDEO } = JOB_ASSET_TYPE;
const { MAIN, SECONDARY, THIRD, THUMBNAIL } = JOB_ASSET_POSITION;

module.exports = (sequelize, DataTypes) => {
  class JobAsset extends Model {
    static associate(models) {
      JobAsset.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
    }
  }
  JobAsset.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fileType: {
        type: DataTypes.ENUM(IMAGE, VIDEO),
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 100] },
      },
      filePosition: {
        type: DataTypes.ENUM(MAIN, SECONDARY, THIRD, THUMBNAIL),
        defaultValue: MAIN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JobAsset",
      tableName: "jobassets",
      timestamps: true,
    }
  );
  return JobAsset;
};
