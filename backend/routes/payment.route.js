import express from "express";
import bodyParser from "body-parser";
import {
  handleStripeWebhook,
  handleMercadoPagoWebhook,
  handlePayPalWebhook,
} from "../controllers/payment.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  stripeWebhookSchema,
  mercadoPagoWebhookSchema,
} from "../schemas/payment.schema.js";

const router = express.Router();

// Stripe webhook uses raw body parser for signature verification
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  // No validation schema needed; raw body is passed to controller
  handleStripeWebhook,
);

// Mercado Pago webhook can use JSON body with validation
router.post(
  "/mercadopago/webhook",
  validateRequest(mercadoPagoWebhookSchema),
  handleMercadoPagoWebhook,
);

router.post(
  "/paypal/webhook",
  bodyParser.raw({ type: "application/json" }),
  // No validation schema needed; raw body is passed
  handlePayPalWebhook,
);

export default router;
