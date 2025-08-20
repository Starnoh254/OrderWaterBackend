const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class feedbackService {
  static async createFeedback({ message }) {
    if (!message) throw new Error("Missing required fields");
    const fb = await prisma.feedback.create({
      data: { message },
    });
    return fb;
  }

  static async listFeedbacks() {
    return prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async getFeedbackById(id) {
    return prisma.feedback.findUnique({ where: { id } });
  }
}

module.exports = feedbackService;
