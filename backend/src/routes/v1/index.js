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
const assetsRoutes = require("./assets-routes");
const kycRoutes = require("./kyc-routes");
const stateRoutes = require("./state-routes");
const districtRoutes = require("./district-routes");
const areaRoutes = require("./area-routes");
const paymentRoutes = require("./payment-routes");
const chargeRoutes = require("./charge-routes");
const clientRoutes = require("./client-routes");
const workerRoutes = require("./worker-routes");
const walletRoutes = require("./wallet-routes");
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
router.use("/assets", assetsRoutes);
router.use("/kyc", kycRoutes);
router.use("/states", stateRoutes);
router.use("/districts", districtRoutes);
router.use("/areas", areaRoutes);
router.use("/payments", paymentRoutes);
router.use("/charges", chargeRoutes);
router.use("/clients", clientRoutes);
router.use("/workers", workerRoutes);
router.use("/wallet", walletRoutes);

module.exports = router;
