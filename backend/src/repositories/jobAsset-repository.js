const CrudRepository = require("./crud-repository");
const { JobAsset } = require("../models");
class JobAssetRepository extends CrudRepository {
  constructor() {
    super(JobAsset);
  }
}

module.exports = JobAssetRepository;
