const express = require("express");
const router = express.Router();
const { StateController } = require("../../controllers");
const {
  createState,
  getAllStates,
  getAllDistrictsOfState,
  updateState,
  destroyState,
} = StateController;
const { verifyUser, verifyAdmin } = require("../../middlewares");

router.post("/", verifyAdmin, createState);
router.get("/", verifyUser, getAllStates);
router.get("/:stateId/districts", verifyUser, getAllDistrictsOfState);

module.exports = router;
