const CrudRepository = require("./crud-repository");
const { Area } = require("../models");
class AreaRepository extends CrudRepository {
  constructor() {
    super(Area);
  }
}

module.exports = AreaRepository;
