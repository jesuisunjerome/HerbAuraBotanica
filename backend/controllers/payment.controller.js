import Order from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import { verifyStripeWebhookSignature } from "../services/stripe.service.js";

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
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error("Stripe webhook missing orderId in metadata");
      return res.status(400).send("Webhook Error: Missing orderId in metadata");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found for ID: ${orderId}`);
      return res.status(404).send("Webhook Error: Order not found");
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

    const updatedOrder = await order.save();

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

  try {
    if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString());
      } catch (error) {
        console.error(
          "Error parsing Mercado Pago webhook body:",
          error.message,
        );
        return res.status(400).send("Webhook Error: Invalid JSON");
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
        console.error("Mercado Pago webhook missing payment ID");
        return res.status(400).send("Webhook Error: Missing payment ID");
      }

      const { getMercadoPagoPaymentDetails } =
        await import("../services/mercadopago.service.js");

      const payment = await getMercadoPagoPaymentDetails(paymentId);

      if (payment.status === "approved") {
        const orderId = payment.external_reference || payment.metadata?.orderId;

        if (!orderId) {
          console.error("Mercado Pago webhook missing orderId in metadata");
          return res
            .status(400)
            .send("Webhook Error: Missing orderId in metadata");
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(`Order not found for ID: ${orderId}`);
          return res.status(404).send("Webhook Error: Order not found");
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

          const updatedOrder = await order.save();
          console.log(
            `Order ${orderId} marked as paid via Mercado Pago webhook.`,
          );

          sendOrderConfirmationEmail(updatedOrder, "client");
          sendOrderConfirmationEmail(updatedOrder, "admin");
        }
      }

      return res.status(200).send("Payment processed successfully");
    }
  } catch (error) {
    console.error("Error handling Mercado Pago webhook:", error.message);
    return res.status(500).send(`Webhook Error: ${error.message}`);
  }
};
