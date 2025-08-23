const express = require("express");
const router = express.Router();
const { ReviewController } = require("../../controllers");
const { createReview, getAllJobReviews, getAllUserReviews } = ReviewController;
const { verifyUser } = require("../../middlewares");

router.post("/", verifyUser, createReview);
router.get("/job/:jobId", verifyUser, getAllJobReviews);
router.get("/user/:userId", verifyUser, getAllUserReviews);

module.exports = router;
