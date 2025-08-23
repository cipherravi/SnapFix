const CrudRepository = require("./crud-repository");
const { Job, User } = require("../models");
class JobRepository extends CrudRepository {
  constructor() {
    super(Job);
  }

  async findByJobId(jobId) {
    try {
      const job = await Job.findOne({ where: { id: jobId } });

      return job;
    } catch (error) {
      throw error;
    }
  }

  async getByjobId(jobId) {
    try {
      const job = await Job.findOne({
        where: { id: jobId },
        include: [
          {
            model: User,
            as: "worker",
            attributes: ["name", "profilePicUrl", "gender"],
          },
        ],
      });
      return job;
    } catch (error) {
      throw error;
    }
  }
  async getAllJobs(filter, sortBy, options = {}) {
    try {
      const jobs = await Job.findAll({
        where: filter,
        order: sortBy,
        ...options,
      });
      return jobs;
    } catch (error) {
      throw error;
    }
  }

  async getMyTasks(userId) {
    try {
      const tasks = await Job.findAll({
        where: { workerId: userId },
      });
      return tasks;
    } catch (error) {
      throw error;
    }
  }
  async getMyJobs(userId) {
    try {
      const jobs = await Job.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      return jobs;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = JobRepository;
