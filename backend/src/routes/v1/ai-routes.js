const express = require("express");
const router = express.Router();
const { AiController } = require("../../controllers");
const { generateJobDescription, recommendJobPricing } = AiController;
const { verifyUser, verifyAdmin } = require("../../middlewares");

router.get("/generate-job-description", verifyUser, generateJobDescription);
router.get("/job-pricing", verifyUser, recommendJobPricing);

module.exports = router;
