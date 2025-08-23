const CrudRepository = require("./crud-repository");
const { Review } = require("../models");
class ReviewRepository extends CrudRepository {
  constructor() {
    super(Review);
  }

  async findReview(reviewerId, jobId) {
    const review = await Review.findOne({
      where: { reviewerId, jobId: jobId },
    });
    return review;
  }
  async findAllJobReviews(jobId) {
    const review = await Review.findAll({
      where: { jobId: jobId },
    });
    return review;
  }
  async findAllUserReviews(userId) {
    const review = await Review.findAll({
      where: { reviewerId: userId },
    });
    return review;
  }
}
module.exports = ReviewRepository;
