import Order from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import logger from "../lib/logger.js";

// Definir el job "SEND_ORDER_EMAIL"
export const defineEmailJob = (agenda) => {
  agenda.define(
    "SEND_ORDER_EMAIL",
    async (job) => {
      const { orderId, type } = job.attrs.data;

      try {
        const order = await Order.findById(orderId).lean();

        if (!order) {
          throw new Error(`Order no encontrada: ${orderId}`);
        }

        await sendOrderConfirmationEmail(order, type);
        logger.info(`Email asíncrono enviado para la orden ${orderId} (Tipo: ${type})`);
        
      } catch (error) {
        logger.error(`Error en Job SEND_ORDER_EMAIL (Orden: ${orderId}): ${error.message}`);
        throw error;
      }
    },
    { priority: "high", concurrency: 10 }
  );
};
