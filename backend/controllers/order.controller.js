import { IVA, ORDER_STATUS, SHIPPING_COST } from "../lib/constants.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import { createMercadoPagoPreference } from "../services/mercadopago.service.js";
import {
  capturePaypalOrder,
  createPaypalOrder,
} from "../services/paypal.service.js";
import { createStripePaymentIntent } from "../services/stripe.service.js";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
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

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, customer } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No hay productos en la orden" });
  }

  try {
    // 1. Verify availability of products and calculate prices
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto no encontrado: ${item.name}` });
      }

      if (product.countInStock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Producto sin stock: ${item.name}` });
      }

      const price = product.price;
      itemsPrice += price * item.quantity;

      verifiedOrderItems.push({
        ...item,
        price, // Snapshotted price from DB
      });
    }

    const shippingPrice = itemsPrice > 100 ? 0 : SHIPPING_COST; // Example logic
    let totalPrice = itemsPrice + shippingPrice;
    const taxPrice = totalPrice * IVA; // 16% IVA
    totalPrice += taxPrice;

    // 2. Create order in DB
    const order = new Order({
      confirmationNumber: `HERB-${Date.now()}-${Math.floor(Math.random() * 1000)}-AURA`,
      orderItems: verifiedOrderItems,
      customer,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false, // Default to false until webhook confirms payment
    });

    const createdOrder = await order.save();

    // 3. Logic for payment processing
    let responseData = { order: createdOrder };
    if (paymentMethod === "PayPal") {
      const paypalOrder = await createPaypalOrder(totalPrice, createdOrder._id);

      responseData.paypalOrderId = paypalOrder.id;
    } else if (paymentMethod === "Stripe" || paymentMethod === "Apple Pay") {
      const amountInCents = Math.round(totalPrice * 100);

      const paymentIntent = await createStripePaymentIntent(
        amountInCents,
        createdOrder._id,
        {
          orderId: createdOrder._id.toString(),
        },
      );

      responseData.stripeClientSecret = paymentIntent.client_secret;
    } else if (paymentMethod === "Mercado Pago") {
      const preference = await createMercadoPagoPreference(
        createdOrder,
        verifiedOrderItems,
      );

      responseData.mercadoPago = {
        preferenceId: preference.preferenceId,
        initPoint: preference.initPoint,
      };
    }

    // 4. Send response
    console.log("Order created successfully:", responseData);
    res.status(201).json(responseData);
  } catch (error) {
    console.log("Server error in createOrder controller", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Capture PayPal payment
// @route   POST /api/orders/:id/capture-paypal
// @access  Public
export const captureOrder = async (req, res) => {
  const { paypalOrderId } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const captureData = await capturePaypalOrder(paypalOrderId);
    if (captureData.status !== "COMPLETED") {
      return res.status(400).json({ message: "Pago no completado" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      update_time: captureData.update_time,
      email_address: captureData.payer.email_address,
    };

    const updatedOrder = await order.save();

    sendOrderConfirmationEmail(updatedOrder, "client");
    sendOrderConfirmationEmail(updatedOrder, "admin");

    res.json({ message: "Pago capturado exitosamente", order: updatedOrder });
  } catch (error) {
    console.log(
      "Server error in capturePaypalPayment controller",
      error.message,
    );
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching order by ID: ${id}`);

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.log("Server error in getOrderById controller", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by confirmation number
// @route   GET /api/orders/confirmation/:confirmationNumber
// @access  Public
export const getOrderByConfirmationNumber = async (req, res) => {
  const { confirmationNumber } = req.params;

  try {
    const order = await Order.findOne({ confirmationNumber });
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.log(
      "Server error in getOrderByConfirmationNumber controller",
      error.message,
    );
    return res.status(500).json({ message: error.message });
  }
};
