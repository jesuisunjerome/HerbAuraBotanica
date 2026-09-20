import { IVA, ORDER_STATUS, SHIPPING_COST } from "../lib/constants.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import {
  applyInventoryForPaidOrder,
  restoreInventoryForCancelledOrder,
} from "../services/inventory.service.js";
import { agenda } from "../lib/queue.js";
import { createMercadoPagoPreference } from "../services/mercadopago.service.js";
import {
  capturePaypalOrder,
  createPaypalOrder,
} from "../services/paypal.service.js";
import { createStripePaymentIntent } from "../services/stripe.service.js";
import mongoose from "mongoose";
import { AppError } from "../lib/error.js";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
  res.json({ data: orders, total, page, pages: Math.ceil(total / limit) });
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { orderItems, shippingAddress, paymentMethod, customer } = req.body;

      if (!orderItems || orderItems.length === 0) {
        throw new AppError("No hay productos en la orden", 400);
      }

      // Verify availability of products, calculate prices, and decrement stock
      let itemsPrice = 0;
      const verifiedOrderItems = [];

      // Obtener todos los productos en una sola consulta
      const productIds = orderItems.map((item) => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);

      const bulkOps = [];

      for (const item of orderItems) {
        const product = products.find((p) => p._id.toString() === item.product.toString());
        
        if (!product) {
          throw new AppError(`Producto no encontrado: ${item.name}`, 404);
        }

        if (product.stockQuantity < item.quantity) {
          throw new AppError(`Producto sin stock o inventario insuficiente para: ${item.name}`, 400);
        }

        const price = product.price;
        itemsPrice += price * item.quantity;
        verifiedOrderItems.push({ ...item, price }); // Snapshotted price from DB

        // Preparar operación atómica en bloque
        bulkOps.push({
          updateOne: {
            filter: { _id: item.product, stockQuantity: { $gte: item.quantity } },
            update: { $inc: { stockQuantity: -item.quantity } },
          },
        });
      }

      // Ejecutar todas las actualizaciones de stock en una sola llamada a DB
      if (bulkOps.length > 0) {
        const bulkResult = await Product.bulkWrite(bulkOps, { session });
        // Si el número de documentos modificados no coincide, significa que alguien compró justo antes
        // y el filtro de $gte evitó que el stock bajara de 0, previniendo stock negativo.
        if (bulkResult.modifiedCount !== orderItems.length) {
          throw new AppError("Error de concurrencia: Algunos productos se agotaron durante tu compra.", 409);
        }
      }

      const shippingPrice = itemsPrice > 100 ? 0 : SHIPPING_COST;
      let totalPrice = itemsPrice + shippingPrice;
      const taxPrice = totalPrice * IVA;
      totalPrice += taxPrice;

      // Create order in DB within the transaction
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
        isPaid: false,
        statusHistory: [
          {
            status: ORDER_STATUS.PROCESSING,
            comment: "Orden creada mediante el checkout.",
            updatedByModel: "System",
          },
        ],
      });

      const createdOrder = await order.save({ session });

      // Logic for payment processing (outside transaction if needed)
      let responseData = { order: createdOrder };
      if (paymentMethod === "PayPal") {
        const paypalOrder = await createPaypalOrder(
          totalPrice,
          createdOrder._id,
        );
        responseData.paypalOrderId = paypalOrder.id;
      } else if (paymentMethod === "Stripe" || paymentMethod === "Apple Pay") {
        const amountInCents = Math.round(totalPrice * 100);
        const paymentIntent = await createStripePaymentIntent(
          amountInCents,
          createdOrder._id,
          { orderId: createdOrder._id.toString() },
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

      res.status(201).json(responseData);
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error creating order:", error.message);

    throw new AppError(error.message || "Error al crear la orden", 500);
  } finally {
    session.endSession();
  }
};

// @desc    Capture PayPal payment
// @route   POST /api/orders/:id/capture-paypal
// @access  Public
export const captureOrder = async (req, res) => {
  const { paypalOrderId } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Orden no encontrada", 404);

  if (order.isPaid) {
    throw new AppError("La orden ya ha sido pagada y procesada", 400);
  }

  const captureData = await capturePaypalOrder(paypalOrderId);
  if (captureData.status !== "COMPLETED")
    throw new AppError("Pago no completado", 400);

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: req.params.id, isPaid: false },
    {
      $set: {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: captureData.id,
          status: captureData.status,
          update_time: captureData.update_time,
          email_address: captureData.payer.email_address,
        },
      },
    },
    { new: true }
  );

  if (!updatedOrder) {
    throw new AppError("La orden fue procesada concurrentemente por otro hilo", 409);
  }

  const orderWithInventory = await applyInventoryForPaidOrder(updatedOrder);

  await agenda.now("SEND_ORDER_EMAIL", { orderId: orderWithInventory._id, type: "client" });
  await agenda.now("SEND_ORDER_EMAIL", { orderId: orderWithInventory._id, type: "admin" });

  res.json({ message: "Pago capturado exitosamente", order: orderWithInventory });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).lean();
  if (!order) throw new AppError("Orden no encontrada", 404);

  res.json(order);
};

// @desc    Get order by confirmation number
// @route   GET /api/orders/confirmation/:confirmationNumber
// @access  Public
export const getOrderByConfirmationNumber = async (req, res) => {
  const { confirmationNumber } = req.params;

  const order = await Order.findOne({ confirmationNumber }).lean();
  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  res.json(order);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  const { updatedStatus: status, comment } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError("Estatus de orden inválido", 400);
  }

  const previousStatus = order.status;
  order.status = status;
  order.statusHistory.push({
    status,
    comment: comment || `Estatus actualizado a ${status}.`,
    updatedBy: req.user._id,
    updatedByModel: "User",
  });

  let updatedOrder = await order.save();

  if (
    previousStatus !== ORDER_STATUS.CANCELLED &&
    status === ORDER_STATUS.CANCELLED
  ) {
    updatedOrder = await restoreInventoryForCancelledOrder(
      updatedOrder,
      req.user?._id || null,
    );
  }

  res.json(updatedOrder);
};
