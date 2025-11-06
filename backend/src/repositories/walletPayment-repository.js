const CrudRepository = require("./crud-repository");
const { WalletPayment } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

class WalletPaymentRepository extends CrudRepository {
  constructor() {
    super(WalletPayment);
  }
}

module.exports = WalletPaymentRepository;
