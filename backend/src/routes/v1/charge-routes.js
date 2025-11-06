const express = require("express");
const router = express.Router();
const { ChargeMasterController } = require("../../controllers");
const { verifyAdmin } = require("../../middlewares");
const { createCharge } = ChargeMasterController;

router.post("/", verifyAdmin, createCharge);

module.exports = router;
