const CrudRepository = require("./crud-repository");
const { JobHistory } = require("../models");
class JobHistoryRepository extends CrudRepository {
  constructor() {
    super(JobHistory);
  }
}

module.exports = JobHistoryRepository;
