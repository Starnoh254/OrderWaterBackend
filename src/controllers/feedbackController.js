const feedbackService = require("../services/feedbackService");

class feedbackController {
  static async createFeedback(req, res) {
    const { message } = req.body;
    try {
      const fb = await feedbackService.createFeedback({
        message,
      });
      res.status(201).json({ message: "Feedback created", feedback: fb });
    } catch (err) {
      if (err.message === "Missing required fields")
        return res.status(400).json({ message: err.message });
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  static async listFeedbacks(req, res) {
    try {
      const list = await feedbackService.listFeedbacks();
      res.status(200).json({ feedbacks: list });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  static async getFeedback(req, res) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id" });
    try {
      const fb = await feedbackService.getFeedbackById(id);
      if (!fb) return res.status(404).json({ message: "Feedback not found" });
      res.status(200).json({ feedback: fb });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

module.exports = feedbackController;
