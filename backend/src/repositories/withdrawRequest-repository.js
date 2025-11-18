const CrudRepository = require("./crud-repository");
const { WithdrawRequest } = require("../models");
class WithdrawRequestRepository extends CrudRepository {
  constructor() {
    super(WithdrawRequest);
  }
}

module.exports = WithdrawRequestRepository;
