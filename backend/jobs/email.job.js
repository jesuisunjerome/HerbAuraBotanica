import { agenda } from "../lib/queue.js";
import Order from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import logger from "../lib/logger.js";

// Definir el job "SEND_ORDER_EMAIL"
agenda.define(
  "SEND_ORDER_EMAIL",
  { priority: "high", concurrency: 10 },
  async (job) => {
    const { orderId, type } = job.attrs.data;

    try {
      // Buscar la orden fresca desde la BD
      const order = await Order.findById(orderId).lean();

      if (!order) {
        throw new Error(`Order no encontrada: ${orderId}`);
      }

      // Enviar el correo usando el servicio existente
      await sendOrderConfirmationEmail(order, type);
      logger.info(`Email asíncrono enviado para la orden ${orderId} (Tipo: ${type})`);
      
    } catch (error) {
      logger.error(`Error en Job SEND_ORDER_EMAIL (Orden: ${orderId}): ${error.message}`);
      // Lanza el error para que Agenda sepa que el trabajo falló y lo marque para reintento
      throw error;
    }
  }
);
