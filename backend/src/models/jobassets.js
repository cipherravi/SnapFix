"use strict";
const { Model } = require("sequelize");
const { JOB_ASSET_TYPE, JOB_ASSET_POSITION } = require("../utils/common/ENUM");
const { IMAGE, VIDEO } = JOB_ASSET_TYPE;
const { MAIN, SECONDARY, THIRD, THUMBNAIL } = JOB_ASSET_POSITION;

module.exports = (sequelize, DataTypes) => {
  class JobAsset extends Model {
    static associate(models) {
      JobAsset.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
      });
    }
  }

  JobAsset.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "job_id",
      },
      fileType: {
        type: DataTypes.ENUM(IMAGE, VIDEO),
        allowNull: false,
        field: "file_type",
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_name",
        validate: {
          len: [1, 100],
        },
      },
      filePosition: {
        type: DataTypes.ENUM(MAIN, SECONDARY, THIRD, THUMBNAIL),
        defaultValue: MAIN,
        allowNull: false,
        field: "file_position",
      },
    },
    {
      sequelize,
      modelName: "JobAsset",
      tableName: "job_assets",
      underscored: true,
      indexes: [
        {
          name: "idx_job_assets_job_id",
          fields: ["job_id"],
        },
      ],
    },
  );

  return JobAsset;
};
