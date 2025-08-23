const express = require("express");
const router = express.Router();
const { AddressController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const { createAddress, getAllAddresses, removeAddress, updateAddress } =
  AddressController;

router.post("/", verifyUser, createAddress);
router.get("/", verifyUser, getAllAddresses);
router.patch("/:addressId", verifyUser, updateAddress);
router.delete("/:addressId", verifyUser, removeAddress);

module.exports = router;
