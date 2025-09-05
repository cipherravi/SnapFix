const express = require("express");
const router = express.Router();
const {
  JobController,
  JobApplicationController,
} = require("../../controllers");
const {
  createJob,
  getJob,
  getAllJobs,
  updateJob,
  destroyJob,
  accept,
  markApproved,
  cancelJob,
  getMyTasks,
  getMyJobs,
} = JobController;
const {
  createJobApplication,
  getAllJobApplicationsForJob,
  getAllJobApplications,
  updateJobApplication,
  destroyJobApplication,
  startWorking,
  markCompleted,
  rejectApplication,
} = JobApplicationController;

const { verifyUser } = require("../../middlewares");
const multer = require("multer");

// Create multer instance first
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Static first
router.post(
  "/",
  verifyUser,
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "secondary", maxCount: 1 },
    { name: "third", maxCount: 1 },
  ]),
  createJob
);
router.get("/applicants", getAllJobApplications);
router.get("/me", verifyUser, getMyJobs);
router.get("/", getAllJobs);

//Dynamic last
router.get("/:jobId/applicants", verifyUser, getAllJobApplicationsForJob);
router.get("/:jobId", getJob);
router.patch("/:jobId", verifyUser, updateJob);
router.delete("/:jobId", verifyUser, destroyJob);
router.post("/:jobId/apply", verifyUser, createJobApplication);
router.post("/:jobId/accept", verifyUser, accept);
router.post("/:jobId/start", verifyUser, startWorking);
router.post("/:jobId/complete", verifyUser, markCompleted);
router.post("/:jobId/approve", verifyUser, markApproved);
router.post("/:jobId/cancel", verifyUser, cancelJob);
router.post(
  "/:jobId/applicants/:jobApplicationId/reject",
  verifyUser,
  rejectApplication
);

module.exports = router;
