import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover", // Use the latest API version
});

/**
 * Create a Stripe Payment Intent to start a payment process.
 */
export async function createStripePaymentIntent(
  totalPriceIncents,
  orderId,
  metadata = {},
  currency = "mxn",
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: totalPriceIncents,
        currency,
        metadata: {
          orderId: orderId.toString(),
          ...metadata,
        },
      },
      {
        idempotencyKey: `order_${orderId}_${Date.now()}`, // Ensure idempotency for this operation, preventing duplicate charges if the request is retried
      },
    );
    return paymentIntent;
  } catch (error) {
    console.error("Error al crear el intento de pago de Stripe:", error);
    throw error;
  }
}

/**
 * Verify a Stripe webhook signature to ensure the request is from Stripe and has not been tampered with.
 */
export function verifyStripeWebhookSignature(request) {
  const signature = request.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    throw new Error("Falta la firma o el secreto del webhook de Stripe");
  }

  try {
    const event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      webhookSecret,
    );
    return event;
  } catch (error) {
    console.error("Error al verificar la firma del webhook de Stripe:", error);
    throw new Error("Firma del webhook de Stripe inválida");
  }
}
