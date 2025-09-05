const express = require("express");
const router = express.Router();
const { AddressController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const {
  createAddress,
  getAllAddresses,
  getAddress,
  removeAddress,
  updateAddress,
} = AddressController;

router.post("/", verifyUser, createAddress);
router.get("/", verifyUser, getAllAddresses);
router.get("/:id", verifyUser, getAddress);
router.patch("/", verifyUser, updateAddress);
router.delete("/:addressId", verifyUser, removeAddress);

module.exports = router;
