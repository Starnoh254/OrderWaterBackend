const orderService = require("../services/orderService");

class orderController {
  // Create a new order
  static async createOrder(req, res) {
    const { name, phone, house } = req.body;
    try {
      const order = await orderService.createOrder({ name, phone, house });
      res.status(201).json({ message: "Order created", order });
    } catch (err) {
      if (err.message === "Order already exists") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  // Fetch all orders
  static async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({ orders });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

module.exports = orderController;
