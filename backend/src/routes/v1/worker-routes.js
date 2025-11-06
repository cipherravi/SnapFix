const express = require("express");
const router = express.Router();

const { JobController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const { getJobForWorker } = JobController;

router.get("/jobs/:jobId", verifyUser, getJobForWorker);

module.exports = router;
