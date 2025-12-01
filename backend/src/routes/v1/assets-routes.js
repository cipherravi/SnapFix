const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middlewares");
const { AssetsController } = require("../../controllers");
const {
  getImageUrl,
  getSignedImageUrl,
  uploadImage,
  uploadProfilePic,
  getProfileImageUrl,
} = AssetsController;

const multer = require("multer");
const upload = multer(multer.memoryStorage());

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.post("/upload/image", upload.single("image"), uploadImage);
router.patch(
  "/upload/profile",
  verifyUser,
  upload.single("profile"),
  uploadProfilePic
);
router.get("/public/image/:fileName", getImageUrl);
router.get("/public/profiles/:fileName", getProfileImageUrl);
router.get("/private/image/:fileName", getSignedImageUrl);

module.exports = router;
