import express from "express";
import {
  handleStripeWebhook,
  handleMercadoPagoWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/stripe/webhook", handleStripeWebhook);
router.post("/mercadopago/webhook", handleMercadoPagoWebhook);

export default router;
