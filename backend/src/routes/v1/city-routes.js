const express = require("express");
const router = express.Router();
const { CityController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");

router.post("/", verifyUser, CityController.createCity);
router.get("/:cityId", verifyUser, CityController.getCity);
router.get("/", verifyUser, CityController.getAllCity);
router.patch("/", verifyUser, CityController.updateCity);
router.delete("/:cityId", verifyUser, CityController.destroyCity);

module.exports = router;
