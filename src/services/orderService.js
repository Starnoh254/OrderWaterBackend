const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendSMS = require('../utils/send');

class orderService {
  // Create order; ensure phone is unique (as per schema)
  static async createOrder({ name, phone, house }) {
    if (!name || !phone || !house) {
      throw new Error("Missing required fields");
    }

    // Check for existing order by phone (schema marks phone unique)
    // const existing = await prisma.orders.findUnique({ where: { phone } });
    // if (existing) {
    //   throw new Error("Order already exists");
    // }

    const order = await prisma.orders.create({
      data: { name, phone, house },
    });

    const message = `New water order \nCustomer: ${order.name}\nPhone: ${order.phone}\nHouse: ${order.house}`;
    sendSMS(message)

    return order;
  }

  // Get all orders
  static async getAllOrders() {
    const orders = await prisma.orders.findMany({ orderBy: { id: 'desc' } });
    return orders;
  }
}

module.exports = orderService;
