const {
  JobChargeRepository,
  JobRepository,
  ChargeMasterRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/AppError");
const { getLogger } = require("../config");
const logger = getLogger(__filename);

const {
  CHARGES_TYPE,
  CHARGES_APPLY_ON,
  CHARGES_APPLICABLE,
} = require("../utils/common/ENUM");
const { FIXED, PERCENTAGE } = CHARGES_TYPE;
const { BASE, SUBTOTAL } = CHARGES_APPLY_ON;
const { ONLINE, ALL } = CHARGES_APPLICABLE;

const { toNumberSafe, round2, roundInt } = require("../utils/helper/decimal");

const jobChargeRepository = new JobChargeRepository();
const jobRepository = new JobRepository();
const chargeMasterRepository = new ChargeMasterRepository();

async function calculateJobCharges(jobId, paymentMethod = ONLINE) {
  try {
    // 1. Fetch the job
    const job = await jobRepository.getById(jobId);
    if (!job) throw new AppError("Job not found", StatusCodes.NOT_FOUND);

    const basePaise = Math.round(toNumberSafe(job.budget) * 100); // rupees -> paise
    let subtotal = basePaise;
    let appliedCharges = [];

    // 2. Fetch all active charges
    const charges = await chargeMasterRepository.findActiveCharges();

    // 3. Filter charges based on payment method and priority
    const applicableCharges = charges
      .filter(
        (charge) =>
          charge.applicable_methods === ALL ||
          charge.applicable_methods === paymentMethod
      )
      .sort((a, b) => a.priority - b.priority);

    // 4. Apply non-gross-up charges
    for (const charge of applicableCharges) {
      if (charge.is_gross_up) continue;

      const rawValue = toNumberSafe(charge.value);
      let amountPaise = 0;

      if (charge.type === FIXED) {
        amountPaise = Math.round(rawValue * 100); // fixed rupees -> paise
      } else if (charge.type === PERCENTAGE) {
        if (charge.apply_on === BASE) {
          amountPaise = Math.round((basePaise * rawValue) / 100);
        } else if (charge.apply_on === SUBTOTAL) {
          amountPaise = Math.round((subtotal * rawValue) / 100);
        }
      }

      subtotal += amountPaise;

      appliedCharges.push({
        jobId,
        chargeId: charge.id,
        name: charge.name,
        amount: amountPaise / 100,
      });
    }

    // 5. Apply gross-up charges (like PG fee)
    for (const charge of applicableCharges) {
      if (!charge.is_gross_up) continue;

      const feePercent = toNumberSafe(charge.value);
      // gross-up in paise
      const grossedTotal = Math.round(
        subtotal / (1 - (feePercent + (feePercent * 18) / 100) / 100)
      );

      let amountPaise = grossedTotal - subtotal;

      subtotal = grossedTotal;

      appliedCharges.push({
        jobId,
        chargeId: charge.id,
        name: charge.name,
        amount: amountPaise / 100,
      });
    }

    // 6. Save to DB
    await jobChargeRepository.bulkUpsert(appliedCharges);

    // 7. Return breakdown
    return {
      jobId,
      baseAmount: basePaise,
      paymentMethod,
      charges: appliedCharges,
      total: subtotal,
    };
  } catch (error) {
    logger.error(error.stack || error.message);
    throw new AppError(
      "Failed to calculate job charges",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function calculateJobChargesPreview(jobId, paymentMethod) {
  try {
    // 1. Fetch the job
    const job = await jobRepository.getById(jobId);
    if (!job) throw new AppError("Job not found", StatusCodes.NOT_FOUND);

    const basePaise = Math.round(toNumberSafe(job.budget) * 100); // rupees -> paise
    let subtotal = basePaise;
    let appliedCharges = [];

    // 2. Fetch all active charges
    const charges = await chargeMasterRepository.findActiveCharges();

    // 3. Filter charges based on payment method and priority
    const applicableCharges = charges
      .filter(
        (charge) =>
          charge.applicable_methods === ALL ||
          charge.applicable_methods === paymentMethod
      )
      .sort((a, b) => a.priority - b.priority);

    // 4. Apply non-gross-up charges
    for (const charge of applicableCharges) {
      if (charge.is_gross_up) continue;

      const rawValue = toNumberSafe(charge.value);
      let amountPaise = 0;

      if (charge.type === FIXED) {
        amountPaise = Math.round(rawValue * 100); // fixed rupees -> paise
      } else if (charge.type === PERCENTAGE) {
        if (charge.apply_on === BASE) {
          amountPaise = Math.round((basePaise * rawValue) / 100);
        } else if (charge.apply_on === SUBTOTAL) {
          amountPaise = Math.round((subtotal * rawValue) / 100);
        }
      }

      subtotal += amountPaise;

      appliedCharges.push({
        jobId,
        chargeId: charge.id,
        name: charge.name,
        amount: amountPaise / 100,
      });
    }

    // 5. Apply gross-up charges (like PG fee)
    for (const charge of applicableCharges) {
      if (!charge.is_gross_up) continue;

      const feePercent = toNumberSafe(charge.value);
      // gross-up in paise

      const grossedTotal = Math.round(
        subtotal / (1 - (feePercent + (feePercent * 18) / 100) / 100)
      );
      let amountPaise = grossedTotal - subtotal;

      subtotal = grossedTotal;

      appliedCharges.push({
        jobId,
        chargeId: charge.id,
        name: charge.name,
        amount: amountPaise / 100,
      });
    }

    // 6. Return breakdown
    return {
      jobId,
      baseAmount: basePaise,
      paymentMethod,
      charges: appliedCharges,
      total: subtotal,
    };
  } catch (error) {
    logger.error(error.stack || error.message);
    throw new AppError(
      "Failed to calculate job charges",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { calculateJobCharges, calculateJobChargesPreview };
