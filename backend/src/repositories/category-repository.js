const CrudRepository = require("./crud-repository");
const { Category } = require("../models");
class CategoryRepository extends CrudRepository {
  constructor() {
    super(Category);
  }
}
module.exports = CategoryRepository;
