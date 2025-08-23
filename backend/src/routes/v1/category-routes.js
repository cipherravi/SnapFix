const express = require("express");
const router = express.Router();
const { CategoryController } = require("../../controllers");
const {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  destroyCategory,
} = CategoryController;
const { verifyUser } = require("../../middlewares");

router.post("/", verifyUser, createCategory);
router.get("/:categoryId", verifyUser, getCategory);
router.get("/", getAllCategory);
router.patch("/", verifyUser, updateCategory);
router.delete("/:categoryId", verifyUser, destroyCategory);

module.exports = router;
