const { getLogger } = require("../config");
const logger = getLogger(__filename);

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    logger.info("Successfully accessed create");

    return response;
  }

  async getById(id) {
    const response = await this.model.findByPk(id);
    logger.info("Successfully accessed getById");
    delete response.dataValues.password;
    return response;
  }

  async getAll() {
    const response = await this.model.findAll();
    logger.info("Successfully accessed getAll");

    return response;
  }
  async update(id, data, options = {}) {
    const updateRecord = await this.model.update(data, {
      where: { id },
      ...options,
    });

    logger.info(`Successfully updated record with id: ${id}`);
    return updateRecord;
  }
  async destroy(id) {
    const response = await this.model.destroy({ where: { id: id } });
    logger.info("Successfully accessed destroy");

    return response;
  }
}

module.exports = CrudRepository;
