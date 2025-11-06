const CrudRepository = require("./crud-repository");
const { JobCharge } = require("../models");
class JobChargeRepository extends CrudRepository {
  constructor() {
    super(JobCharge);
  }

  async bulkUpsert(charges) {
    if (!charges || charges.length === 0) return [];

    const jobId = charges[0].jobId; // assume all charges belong to same job
    const chargeIds = charges.map((c) => c.chargeId);

    // delete existing charges
    await JobCharge.destroy({
      where: { jobId, chargeId: chargeIds },
    });

    // insert new ones
    return await JobCharge.bulkCreate(charges, { returning: true });
  }

  async getAllChargesForJob(jobId) {
    try {
      const charges = await JobCharge.findAll({ where: { jobId } });
      return charges || [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobChargeRepository;
