const RATES = {
  JOB_COMMISSION_ON_PAID: 0.1,
  JOB_COMMISSION_ON_COD: 0.9, // bcz worker has collected money already so total - 90% of job.budget
};

module.exports = RATES;
