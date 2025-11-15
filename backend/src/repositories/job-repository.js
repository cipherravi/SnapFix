const CrudRepository = require("./crud-repository");
const { Job, User, JobAsset, Payment } = require("../models");
const { Op } = require("sequelize");
const { JOB_STATUS } = require("../utils/common/ENUM");
const { APPROVED, CANCELLED } = JOB_STATUS;
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
          {
            model: JobAsset,
            as: "assets",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      return job;
    } catch (error) {
      throw error;
    }
  }
  async getByjobIdForWorker(jobId) {
    try {
      const job = await Job.findOne({
        where: { id: jobId },
        include: [
          {
            model: Payment,
            as: "activePayment",
            attributes: {
              exclude: [
                "refund_amount",
                "refund_reference",
                "provider",
                "razorpay_order_id",
                "razorpay_payment_id",
                "razorpay_signature",
                "txn_reference",
                "attempt_status",
              ],
            },
          },
          {
            model: JobAsset,
            as: "assets",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      return job;
    } catch (error) {
      throw error;
    }
  }

  async getByjobIdForPublic(jobId) {
    try {
      const job = await Job.findOne({
        where: { id: jobId },
        attributes: {
          exclude: [
            "status",
            "updatedAt",
            "userId",
            "worker",
            "workerId",
            "addressId",
          ],
        },
        include: [
          {
            model: JobAsset,
            as: "assets",
            attributes: { exclude: ["createdAt", "updatedAt"] },
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
        include: [
          {
            model: JobAsset,
            as: "assets",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
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
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Payment,
            as: "activePayment",
            attributes: ["id", "amount", "currency", "method", "status"],
          },
        ],
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
        order: [["updatedAt", "DESC"]],
      });
      return jobs;
    } catch (error) {
      throw error;
    }
  }

  async countMyCODActiveJobs(userId) {
    try {
      return await Job.count({
        where: { userId, status: { [Op.notIn]: [APPROVED, CANCELLED] } },
        include: [
          {
            model: Payment,
            as: "activePayment",
            where: { method: "cod" },
            required: true,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}
module.exports = JobRepository;
