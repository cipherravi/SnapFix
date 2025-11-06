const express = require("express");
const router = express.Router();

const { JobController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const { getJobForClient } = JobController;

router.get("/jobs/:jobId", verifyUser, getJobForClient);

module.exports = router;
