const { getLogger } = require("../config");
const logger = getLogger(__filename);

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, options = {}) {
    try {
      const response = await this.model.create(data, { ...options });
      logger.info("Successfully accessed create");

      return response;
    } catch (error) {
      logger.error("Error in (crud) create:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await this.model.findByPk(id);
      logger.info("Successfully accessed getById");
      delete response.dataValues.password;
      return response;
    } catch (error) {
      logger.error("Error in (crud) getById:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      const response = await this.model.findAll();
      logger.info("Successfully accessed getAll");

      return response;
    } catch (error) {
      logger.error("Error in (crud) getAll:", error);
      throw error;
    }
  }
  async update(id, data, options = {}) {
    try {
      const updateRecord = await this.model.update(data, {
        where: { id },
        ...options,
      });

      logger.info(`Successfully updated record with id: ${id}`);
      return updateRecord;
    } catch (error) {
      logger.error("Error in (crud) update:", error);
      throw error;
    }
  }
  async destroy(id) {
    try {
      const response = await this.model.destroy({ where: { id: id } });
      logger.info("Successfully accessed destroy");

      return response;
    } catch (error) {
      logger.error("Error in (crud) destroy:", error);
      throw error;
    }
  }
}

module.exports = CrudRepository;
