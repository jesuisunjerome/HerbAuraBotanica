import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import handlebars from "handlebars";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { IVA } from "../lib/constants.js";
import logger from "../lib/logger.js";

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  family: 4,
});

/**
 * Compiles a handlebars template from the templates directory.
 */
const compileTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, `../templates/${templateName}.hbs`);
  const html = fs.readFileSync(filePath, "utf-8");
  const template = handlebars.compile(html);
  return template(data);
};

export const sendOrderConfirmationEmail = async (order, type = "client") => {
  const isAdminEmail = type === "admin";
  const toAddress = isAdminEmail
    ? process.env.EMAIL_USER
    : order.customer.email;

  const subject = isAdminEmail
    ? "Nuevo pedido recibido - Detalles del cliente"
    : "Confirmación de tu pedido en HerbAura Botánica";

  const urlPanelAdmin = `${process.env.CLIENT_URL}/admin/orders/${order._id}`;
  const urlTrackOrder = `${process.env.CLIENT_URL}/track/${order.confirmationNumber}`;

  const templateData = {
    title: isAdminEmail ? "Nuevo pedido recibido" : "¡Gracias por tu compra!",
    message: isAdminEmail
      ? `Se ha recibido un nuevo pedido con número de confirmación #${order.confirmationNumber}. Revisa los detalles del cliente y del pedido en el <a href="${urlPanelAdmin}">panel de administración</a>.`
      : `El pedido #${order.confirmationNumber} ha sido confirmado y está siendo preparado con dedicación en nuestro taller. Te enviaremos una notificación cuando tu pedido esté listo para ser enviado.`,
    items: order.orderItems.map(item => ({
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      total: (item.quantity * item.price).toFixed(2)
    })),
    order: {
      itemsPrice: order.itemsPrice?.toFixed(2),
      taxPrice: order.taxPrice?.toFixed(2),
      shippingPrice: order.shippingPrice?.toFixed(2),
      totalPrice: order.totalPrice?.toFixed(2),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    },
    taxPercent: (IVA * 100).toFixed(2),
    urlTrackOrder,
    clientUrl: process.env.CLIENT_URL,
    currentYear: new Date().getFullYear(),
  };

  const html = compileTemplate("order-confirmation", templateData);

  try {
    const mailOptions = {
      from: `HerbAura Botanica <${process.env.EMAIL_USER}>`,
      to: toAddress,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Correo de confirmación enviado exitosamente a ${toAddress}`);
  } catch (error) {
    logger.error(`Error al enviar el correo a ${toAddress}: ${error.message}`);
  }
};

export const sendLowStockAlertEmail = async ({
  name,
  stockQuantity,
  lowStockThreshold,
}) => {
  const subject = `Alerta de inventario bajo: ${name}`;

  const html = compileTemplate("low-stock", {
    name,
    stockQuantity,
    lowStockThreshold,
  });

  try {
    await transporter.sendMail({
      from: `HerbAura Botanica <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject,
      html,
    });
    logger.info(`Alerta de inventario bajo enviada para ${name}`);
  } catch (error) {
    logger.error(`Error al enviar alerta de inventario bajo: ${error.message}`);
  }
};
