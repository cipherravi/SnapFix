const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { getProfile, getMyProfile, getProfiles, updateUser } = UserController;

const { verifyUser } = require("../../middlewares");

const { JobController } = require("../../controllers");
const { getMyTasks } = JobController;

router.get("/me", verifyUser, getMyProfile);
router.get("/profiles", verifyUser, getProfiles);
router.patch("/me", verifyUser, updateUser);
router.get("/tasks", verifyUser, getMyTasks);

router.get("/:id", verifyUser, getProfile);

module.exports = router;
