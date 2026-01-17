import Order from "../models/Order.js";

export const getAllOrders = async (_, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log("Server error in getAllOrders controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log("Server error in getOrderById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderByConfirmationNumber = async (req, res) => {
  const { confirmationNumber } = req.params;

  try {
    const order = await Order.findOne({ confirmationNumber });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(
      "Server error in getOrderByConfirmationNumber controller",
      error.message
    );
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const orderData = req.body;

  try {
    if (orderData.products.length === 0) {
      return res
        .status(400)
        .json({ message: "An order must have at least one product." });
    }

    const orderConfirmationNumber = `#HERB-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}-AURA`;
    orderData.confirmationNumber = orderConfirmationNumber;

    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.log("Server error in createOrder controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatusById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.log(
      "Server error in updateOrderStatusById controller",
      error.message
    );
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Cancelado" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log("Server error in deleteOrderById controller", error.message);
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
