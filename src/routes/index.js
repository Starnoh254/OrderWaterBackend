const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const orderRoutes = require("./orderRoutes");
const feedbackRoutes = require("./feedbackRoutes");

// Map routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/order", orderRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;
