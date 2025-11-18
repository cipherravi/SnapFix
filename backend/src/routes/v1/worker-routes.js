const express = require("express");
const router = express.Router();

const {
  JobController,
  WorkerBankDetailController,
} = require("../../controllers");
const { verifyUser, workerBankDetail } = require("../../middlewares");
const { verifyCreate } = workerBankDetail;
const { getJobForWorker } = JobController;
const {
  createWokerBankDetail,
  getWorkerBankDetails,
  getWorkerBankDetail,
  deleteWorkerBankDetail,
} = WorkerBankDetailController;

router.get("/jobs/:jobId", verifyUser, getJobForWorker);

// bank details
router.post("/bank-details", verifyUser, verifyCreate, createWokerBankDetail);
router.get("/bank-details", verifyUser, getWorkerBankDetails);
router.get("/bank-details/:id", verifyUser, getWorkerBankDetail);
// router.patch("/bank-details/:id", verifyUser); // NOT ALLOWED
router.delete("/bank-details/:id", verifyUser, deleteWorkerBankDetail);

module.exports = router;
