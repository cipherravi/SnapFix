const CrudRepository = require("./crud-repository");
const { KycDocument } = require("../models");

class KycDocumentRepository extends CrudRepository {
  constructor() {
    super(KycDocument);
  }
}

module.exports = KycDocumentRepository;
