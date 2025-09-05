const express = require("express");
const router = express.Router();
const { AssetsController } = require("../../controllers");
const { getImageUrl, getSignedImageUrl, uploadImage } = AssetsController;

const multer = require("multer");
const upload = multer(multer.memoryStorage());

router.post("/upload/image", upload.single("image"), uploadImage);
router.get("/public/image/:fileName", getImageUrl);
router.get("/private/image/:fileName", getSignedImageUrl);

module.exports = router;
