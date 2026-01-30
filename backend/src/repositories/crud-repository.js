const { getLogger } = require("../config");
const logger = getLogger(__filename);

class CrudRepository {
  constructor(model) {
    this.model = model;
    this.modelName = model.name || "UnknownModel";
  }

  async create(data, options = {}) {
    logger.info(`[${this.modelName}] create - START`, { data });

    try {
      const response = await this.model.create(data, { ...options });

      logger.info(`[${this.modelName}] create - SUCCESS`, {
        id: response.id,
      });

      return response;
    } catch (error) {
      logger.error(`[${this.modelName}] create - ERROR`, {
        data,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getById(id) {
    logger.info(`[${this.modelName}] getById - START`, { id });

    try {
      const response = await this.model.findByPk(id);

      if (!response) {
        logger.warn(`[${this.modelName}] getById - NOT FOUND`, {
          id,
        });
      } else {
        logger.info(`[${this.modelName}] getById - SUCCESS`, {
          id: response.id,
        });
      }

      return response;
    } catch (error) {
      logger.error(`[${this.modelName}] getById - ERROR`, {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAll() {
    logger.info(`[${this.modelName}] getAll - START`);

    try {
      const response = await this.model.findAll();
      logger.info(
        `[${this.modelName}] getAll - SUCCESS, records fetched: ${response.length}`,
      );
      return response;
    } catch (error) {
      logger.error(`[${this.modelName}] getAll - ERROR`, {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async update(id, data, options = {}) {
    logger.info(`[${this.modelName}] update - START`, {
      id,
      data,
    });

    try {
      const [updatedCount] = await this.model.update(data, {
        where: { id },
        ...options,
      });

      if (updatedCount === 0) {
        logger.warn(`[${this.modelName}] update - NO RECORD UPDATED`, {
          id,
          data,
        });
      } else {
        logger.info(`[${this.modelName}] update - SUCCESS`, {
          id,
        });
      }

      return updatedCount;
    } catch (error) {
      logger.error(`[${this.modelName}] update - ERROR`, {
        id,
        data,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async destroy(id) {
    logger.info(`[${this.modelName}] destroy - START`, { id });

    try {
      const deletedCount = await this.model.destroy({ where: { id } });

      if (deletedCount === 0) {
        logger.warn(`[${this.modelName}] destroy - NO RECORD DELETED`, {
          id,
        });
      } else {
        logger.info(`[${this.modelName}] destroy - SUCCESS`, {
          id,
        });
      }

      return deletedCount;
    } catch (error) {
      logger.error(`[${this.modelName}] destroy - ERROR`, {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = CrudRepository;
