const CrudRepository = require("./crud-repository");
const { JobApplication, User, City } = require("../models");
const { JOB_APPLICATION_STATUS } = require("../utils/common/ENUM");
const { REJECTED } = JOB_APPLICATION_STATUS;
const { Op } = require("sequelize");

const { getLogger } = require("../config");
const logger = getLogger(__filename);

class JobApplicationRepository extends CrudRepository {
  constructor() {
    super(JobApplication);
  }
  async findJobApplication(workerId, jobId) {
    try {
      const jobApplication = await JobApplication.findOne({
        where: {
          userId: workerId,
          jobId: jobId,
        },
      });

      return jobApplication;
    } catch (error) {
      throw error;
    }
  }

  async findAllJobApplications(jobId) {
    try {
      const applications = await JobApplication.findAll({
        where: { jobId: jobId, status: { [Op.ne]: REJECTED } },
        include: [
          {
            model: User,
            as: "worker",
            attributes: ["name", "profilePicUrl", "gender"],
          },
        ],
      });

      return applications;
    } catch (error) {
      logger.error(
        "Error occured in findAllJobApplications of jobapplication-repository",
        error
      );
      throw error;
    }
  }
}
module.exports = JobApplicationRepository;
