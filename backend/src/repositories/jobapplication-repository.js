const CrudRepository = require("./crud-repository");
const { JobApplication, User, City } = require("../models");
const { JOB_APPLICATION_STATUS } = require("../utils/common/ENUM");
const { REJECTED } = JOB_APPLICATION_STATUS;
const { Op } = require("sequelize");
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
            include: [
              {
                model: City,
                as: "city",
                attributes: ["name", "state", "pincode"],
              },
            ],
          },
        ],
      });

      return applications;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = JobApplicationRepository;
