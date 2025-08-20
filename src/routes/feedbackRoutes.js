const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Create feedback
router.post("/", feedbackController.createFeedback);
// List feedbacks
router.get("/", feedbackController.listFeedbacks);
// Get single feedback
router.get("/:id", feedbackController.getFeedback);

module.exports = router;
