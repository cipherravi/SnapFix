const express = require("express");
const router = express.Router();
const { KycController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const multer = require("multer");

// Create multer instance first
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/submit",
  verifyUser,
  upload.fields([
    { name: "id_front", maxCount: 1 },
    { name: "id_back", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  KycController.handleKycSubmit
);

module.exports = router;
