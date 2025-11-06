const express = require("express");
const router = express.Router();
const { KycController } = require("../../controllers");
const { verifyUser, verifyAdmin } = require("../../middlewares");
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
); // Done

router.get("/applicants", verifyAdmin); // P
router.get("/applicants/:id", verifyAdmin); // P
router.get("/verified", verifyAdmin); // P
router.get("/verified/me", verifyAdmin); // P
router.post("/verify/:id", verifyAdmin); // P
router.post("/reject", verifyAdmin); // P

module.exports = router;
