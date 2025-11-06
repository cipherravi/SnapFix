const express = require("express");
const router = express.Router();
const { AreaController } = require("../../controllers");
const { verifyUser, verifyAdmin } = require("../../middlewares");
const { createArea, getAllAreas, updateArea, destroyArea } = AreaController;

router.post("/", verifyAdmin, createArea);
router.get("/", verifyUser, getAllAreas);

module.exports = router;
