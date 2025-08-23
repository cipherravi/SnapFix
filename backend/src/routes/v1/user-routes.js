const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");

const { JobController } = require("../../controllers");
const { getMyTasks } = JobController;

router.get("/me", verifyUser, UserController.getProfile);
router.get("/profiles", verifyUser, UserController.getProfiles);
router.patch("/me", verifyUser, UserController.updateUser);
router.get("/tasks", verifyUser, getMyTasks);

router.get("/:id", verifyUser, UserController.getProfile);

module.exports = router;
