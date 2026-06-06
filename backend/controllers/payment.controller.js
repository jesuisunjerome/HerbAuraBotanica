import Order from "../models/Order.js";
import { applyInventoryForPaidOrder } from "../services/inventory.service.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import { verifyStripeWebhookSignature } from "../services/stripe.service.js";
import { verifyPayPalWebhookSignature } from "../services/paypal.service.js";
import { AppError } from "../lib/error.js";

// @desc    Handle Stripe webhooks
// @route   POST /api/payments/stripe/webhook
// @access  Stripe only (via webhook signature verification)
export const handleStripeWebhook = async (req, res) => {
  let event;

  console.log("stripe webhook");

  try {
    event = verifyStripeWebhookSignature(req);
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );
    throw new AppError("Error de Webhook: Firma no válida", 400);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error("Stripe webhook missing orderId in metadata");
      throw new AppError("Error de Webhook: Falta orderId en metadata", 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found for ID: ${orderId}`);
      throw new AppError("Error de Webhook: Orden no encontrada", 404);
    }

    if (order.isPaid) {
      console.log(
        `Order ${orderId} is already marked as paid. Ignoring duplicate webhook.`,
      );
      return res.json({ received: true });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date(paymentIntent.created * 1000).toISOString(),
      email_address: paymentIntent.receipt_email || "",
    };

    const updatedOrder = await applyInventoryForPaidOrder(order);

    console.log(`Order ${orderId} marked as paid via Stripe webhook.`);

    sendOrderConfirmationEmail(updatedOrder, "client");
    sendOrderConfirmationEmail(updatedOrder, "admin");
  } else if (event.type === "payment_intent.payment_failed") {
  }

  res.json({ received: true });
};

// @desc    Create Mercado Page preference
// @route   POST /api/payments/mercadopago/webhook
// @access  Mercado Pago only
export const handleMercadoPagoWebhook = async (req, res) => {
  let body = req.body;

  if (Buffer.isBuffer(req.body)) {
    try {
      body = JSON.parse(req.body.toString());
    } catch (error) {
      console.error("Error parsing Mercado Pago webhook body:", error.message);
      throw new AppError("Error de Webhook: JSON inválido", 400);
    }
  }

  const { action, data, type } = body;

  if (
    action === "payment.created" ||
    action === "payment.updated" ||
    type === "payment"
  ) {
    const paymentId = data?.id || body.resource?.split("/").pop();
    if (!paymentId) {
      throw new AppError("Error de Webhook: Falta ID de pago", 400);
    }

    const { getMercadoPagoPaymentDetails } =
      await import("../services/mercadopago.service.js");

    const payment = await getMercadoPagoPaymentDetails(paymentId);

    if (payment.status === "approved") {
      const orderId = payment.external_reference || payment.metadata?.orderId;

      if (!orderId) {
        console.error("Mercado Pago webhook missing orderId in metadata");
        throw new AppError("Error de Webhook: Falta orderId en metadata", 400);
      }

      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Order not found for ID: ${orderId}`);
        throw new AppError("Error de Webhook: Orden no encontrada", 404);
      }

      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: payment.id.toString(),
          status: payment.status,
          update_time: payment.date_approved,
          email_address: payment.payer?.email || "",
        };

        const updatedOrder = await applyInventoryForPaidOrder(order);
        console.log(
          `Order ${orderId} marked as paid via Mercado Pago webhook.`,
        );

        sendOrderConfirmationEmail(updatedOrder, "client");
        sendOrderConfirmationEmail(updatedOrder, "admin");
      }
    }

    return res.status(200).send("Pago procesado correctamente");
  }
};

export const handlePayPalWebhook = async (req, res) => {
  // Verify PayPal webhook signature
  try {
    await verifyPayPalWebhookSignature(req);
  } catch (error) {
    console.error(
      "PayPal webhook signature verification failed:",
      error.message,
    );
    return res.status(400).send(`Error de Webhook: ${error.message}`);
  }

  let body = req.body;

  if (Buffer.isBuffer(req.body)) {
    try {
      body = JSON.parse(req.body.toString());
    } catch (error) {
      console.error("Error parsing PayPal webhook body:", error.message);
      return res.status(400).send("Error de Webhook: JSON inválido");
    }
  }

  const { event_type, resource } = body;

  if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = resource?.custom_id || resource?.invoice_id;
    if (!orderId) {
      throw new AppError("Error de Webhook: Falta orderId en recurso", 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Error de Webhook: Orden no encontrada", 404);
    }

    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: resource.id,
        status: resource.status,
        update_time: resource.update_time,
        email_address: resource.payer?.email_address || "",
      };

      const updatedOrder = await applyInventoryForPaidOrder(order);

      sendOrderConfirmationEmail(updatedOrder, "client");
      sendOrderConfirmationEmail(updatedOrder, "admin");
    }
    return res.status(200).send("Pago procesado correctamente");
  }

  // For other event types, acknowledge receipt
  return res.json({ received: true });
};
