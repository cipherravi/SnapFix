const REVIEW = {
  CREATE_SUCCESS: "Review created successfully.",
  CREATE_FAILURE: "Failed to create review.",

  GET_JOB_REVIEWS_SUCCESS: "Fetched job reviews successfully.",
  GET_JOB_REVIEWS_FAILURE: "Failed to fetch job reviews.",

  GET_USER_REVIEWS_SUCCESS: "Fetched user reviews successfully.",
  GET_USER_REVIEWS_FAILURE: "Failed to fetch user reviews.",

  NOT_FOUND: "The job you're trying to review does not exist.",
  ALREADY_REVIEWED: "You have already submitted a review for this job.",
  NOT_APPROVED: "You can only review a job that has been completed.",
  INVALID_RATING: "Rating must be a number between 1 and 5.",
  COMMENT_TOO_LONG: "Comment is too long. Max 200 characters allowed.",
  SERVER_ERROR: "Something went wrong while creating the review.",
};

module.exports = REVIEW;
