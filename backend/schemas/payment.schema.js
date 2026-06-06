import { z } from "zod";

// Stripe webhook sends raw JSON body with a specific event structure.
// For validation we only ensure the body is an object (the raw body is already parsed as string).
export const stripeWebhookSchema = z.object({
  // No strict shape – we accept any JSON payload; the controller will verify signature.
}).passthrough();

// Mercado Pago webhook payload expected fields.
export const mercadoPagoWebhookSchema = z.object({
  action: z.string().optional(),
  type: z.string().optional(),
  data: z.object({
    id: z.string().optional(),
  }).optional(),
  resource: z.string().optional(),
}).passthrough();
