const CrudRepository = require("./crud-repository");
const { Payment } = require("../models");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  ATTEMPT_STATUS,
} = require("../utils/common/ENUM");
const { COD, ONLINE, WALLET } = PAYMENT_METHOD;
const { ACTIVE } = ATTEMPT_STATUS;
const { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED } = PAYMENT_STATUS;

class PaymentRepository extends CrudRepository {
  constructor() {
    super(Payment);
  }
  async findPayment(jobId, userId) {
    try {
      const payment = await Payment.findOne({
        where: {
          jobId,
          userId,
          attempt_status: ACTIVE,
        },
      });
      return payment;
    } catch (error) {
      logger.error("Error occured in findPayment of payment-repository", error);
      throw error;
    }
  }
}
module.exports = PaymentRepository;
