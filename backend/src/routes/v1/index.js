const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const cityRoutes = require("./city-routes");
const jobRoutes = require("./job-routes");
const categoryRoutes = require("./category-routes");
const reviewRoutes = require("./review-routes");
const adminRoutes = require("./admin-routes");
const conversationRoutes = require("./coversation-routes");
const addressRoutes = require("./address-routes");
const { verifyUser } = require("../../middlewares");

router.get("/health", (req, res) => {
  res.status(200).json({ status: true, message: "Server is live 🥂" });
});
router.get("/check-auth", verifyUser, (req, res) => {
  res.status(200).json({ status: true, message: "Verified user" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cities", cityRoutes);
router.use("/jobs", jobRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes); // only admin can access
router.use("/conversations", conversationRoutes);
router.use("/addresses", addressRoutes);

module.exports = router;
