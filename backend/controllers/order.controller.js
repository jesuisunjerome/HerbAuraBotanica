import { ORDER_STATUS } from "../lib/constants.js";
import Order from "../models/Order.js";

export const getAllOrders = async (_, res) => {
  try {
    console.log("getAllOrders controller");

    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by most recent
    res.json(orders);
  } catch (error) {
    console.log("Server error in getAllOrders controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("getOrderById controller");

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.log("Server error in getOrderById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    console.log("updateOrderStatus controller");

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    order.status = status || order.status;
    order.isDelivered =
      status === ORDER_STATUS.DELIVERED ? true : order.isDelivered;
    order.deliveredAt =
      status === ORDER_STATUS.DELIVERED ? new Date() : order.deliveredAt;

    await order.save();

    res.json({ message: "Estado de la orden actualizado", order });
  } catch (error) {
    console.log("Server error in updateOrderStatus controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// TODO: Implement the following controller function (Checkout and Send email with order details and confirmation number)
export const checkoutOrder = (req, res) => {
  res.send("Checkout order");
};

export const sendOrderConfirmationEmail = (req, res) => {
  res.send("Send order confirmation email");
};
