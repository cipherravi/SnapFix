const express = require("express");
const router = express.Router();

const { DistrictController } = require("../../controllers");
const {
  createDistrict,
  getAllDistricts,
  getAllCitiesOfDistrict,
  updateDistrict,
  destroyDistrict,
} = DistrictController;
const { verifyAdmin, verifyUser } = require("../../middlewares");

router.post("/", verifyAdmin, createDistrict);
router.get("/", verifyUser, getAllDistricts);
router.get("/:districtId/cities", verifyUser, getAllCitiesOfDistrict);

module.exports = router;
