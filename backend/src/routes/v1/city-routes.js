const express = require("express");
const router = express.Router();
const { CityController } = require("../../controllers");
const {
  createCity,
  getCity,
  getAllCity,
  getAllAreasOfCity,
  updateCity,
  destroyCity,
} = CityController;
const { verifyUser, verifyAdmin } = require("../../middlewares");

router.post("/", verifyAdmin, createCity);
router.get("/:cityId", verifyUser, getCity);
router.get("/", verifyUser, getAllCity);
router.patch("/", verifyAdmin, updateCity);
router.delete("/:cityId", verifyAdmin, destroyCity);
router.get("/:cityId/areas", verifyUser, getAllAreasOfCity);

module.exports = router;
