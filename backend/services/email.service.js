import nodemailer from "nodemailer";
import "dotenv/config";
import { IVA } from "../lib/constants.js";

// Configuración del transporte de correo utilizando Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD, // Utiliza una contraseña de aplicación generada en tu cuenta de Google
  },
  family: 4, // Forzar IPv4 para evitar problemas de conexión
});

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

  const itemsListHtml = order.orderItems
    .map(
      (item) => `
       <tr>
          <td style="padding: 5px; border-bottom: 1px solid #f3f4f6;">
            <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; padding:8px; background-color: #f3f4f6;" />
          </td>
          <td style="padding: 5px; border-bottom: 1px solid #f3f4f6;">
            <h4 style="margin: 0">${item.name}</h4>
            <small style="color: #6a7282; display: block; margin-bottom: 8px; font-size: 11px;">
            ${item.quantity} x $${item.price.toFixed(2)} MXN
            </small>
          </td>
          <td style="padding: 5px; border-bottom: 1px solid #f3f4f6;">
            $${(item.quantity * item.price).toFixed(2)} MXN
          </td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #364153; background-color: #f9f9f9; padding:15px">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 10px; border-radius: 8px;">
        <header style="text-align: center; margin-bottom: 20px; padding-top:20px">
          <img alt="Logo de HerbAura Botanica" height="80" src="https://herbaurabotanica-front.onrender.com/logos/logo.png" style="height: 80px; object-fit: contain; display: block; margin: 0 auto;" />
        </header>
        <main>
          <div style="margin-bottom: 20px;">
            <h1 style="text-align: center;">${isAdminEmail ? "Nuevo pedido recibido" : "¡Gracias por tu compra!"}</h1>
            <h4 style="text-align: center; color: #6a7282; max-width: 400px; margin: 0 auto;">
            ${isAdminEmail ? "Se ha recibido un nuevo pedido con número de confirmación #" + order.confirmationNumber + '. Revisa los detalles del cliente y del pedido en el <a href="' + urlPanelAdmin + '">panel de administración</a>.' : "El pedido #" + order.confirmationNumber + " ha sido confirmado y está siendo preparado con dedicación en nuestro taller. Te enviaremos una notificación cuando tu pedido esté listo para ser enviado."}
            </h4>
          </div>
          <div style="padding:10px 20px; margin-bottom: 20px; border-radius: 8px;">
            <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 15px;margin-bottom: 10px;">Detalles del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
             ${itemsListHtml}
              <tr>
                <td style="padding: 10px; padding-bottom: 5px;">
                  Subtotal
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.itemsPrice?.toFixed(2)} MXN</td>
              </tr>
              <tr>
                <td style="padding: 10px; padding-bottom: 5px;">
                  IVA (${(IVA * 100).toFixed(2)}%)
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.taxPrice?.toFixed(2)} MXN</td>
              </tr>
              <tr>
                <td style="padding: 10px; padding-bottom: 5px;">
                  Envío
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.shippingPrice?.toFixed(2)} MXN</td>
              </tr>
              <tr style="font-weight: 700;">
                <td style="padding: 10px; padding-bottom: 5px;">
                  Total
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.totalPrice?.toFixed(2)} MXN</td>
              </tr>
            </table>

            <div style="padding-left:10px; padding-right:10px">
              <a href="${urlTrackOrder}" style="display: block; text-align:center; padding: 10px 20px; background-color: #964900; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">Rastrear Pedido</a>
            </div>
          </div>
          <div style="padding:10px 20px; margin-bottom: 20px;">
            <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 10px;">Información de Envío</h3>
            <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0;">
              <tr>
                <td style="width: 50%; background-color: #e5e7eb2e; border-radius: 8px; padding: 20px; vertical-align: top;">
                  <h3 style="color: #964900;">Enviar a</h3>
                  <p style="margin:0; line-height: 1.5;">
                    ${order.shippingAddress.address},<br />
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode},<br />
                    ${order.shippingAddress.country}
                  </p>
                </td>
                <td style="width: 50%; background-color: #e5e7eb2e; border-radius: 8px; padding: 20px; vertical-align: top;">
                  <h3 style="color: #964900;">Info de Pago</h3>
                  <p style="margin:0; line-height: 1.5;">
                      ${order.paymentMethod}
                  </p>
                </td>
            </table>
          </div>
          <div style="padding:20px 10px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;>
              <tr>
                <td style="width: 50%; padding-right:10px">
                  <h3>El Ritual de Recepción</h3>
                  <p style="line-height: 1.5;">
                    Nuestro empaque está diseñado para ser una extensión sensorial del bosque. Cada caja es libre de plástico e infundida con el sutil aroma de la madera de cedro. Te invitamos a reutilizar los envases de vidrio una vez que estén vacíos.
                  </p>
                  <div>
                    <span style="display:inline-block; margin:1px; color: #244f33; padding: 4px 10px; border-radius: 20px; background-color: #a2d2ac; font-size: 10px;">Orgánico</span>
                    <span style="display:inline-block; margin:1px; color: #244f33; padding: 4px 10px; border-radius: 20px; background-color: #a2d2ac; font-size: 10px;">Ético</span>
                    <span style="display:inline-block; margin:1px; color: #244f33; padding: 4px 10px; border-radius: 20px; background-color: #a2d2ac; font-size: 10px;">Sostenible</span>
                  </div>
                </td>
                <td style="width: 50%;">
                  <img src="https://herbaurabotanica-front.onrender.com/images/7.png" alt="Experiencia de unboxing con productos botánicos en un entorno rústico" style="width: 100%; height: 290px; background-color: #e5e7eb2e; border-radius: 8px; object-fit: cover;" />
                </td>
              </tr>
            </table>
          </div>
        </main>
        <footer style="text-align: center; padding:10px 20px; background-color: #f4f3f1; border-radius: 0 0 8px 8px;">
          <h3 style="margin: 0;">HerbAura Botanica</h3>
          <p style="margin-top: 0;">Where herbs nurture your hair's aura</p>
          <nav>
            <a href="${urlTrackOrder}" style="margin: 0 10px; color: #624242; text-decoration: none;">Rastrear Pedido</a>
            <a href="${process.env.CLIENT_URL}/terms" style="margin: 0 10px; color: #624242; text-decoration: none;">Política de Envío</a>
            <a href="${process.env.CLIENT_URL}/contact" style="margin: 0 10px; color: #624242; text-decoration: none;">Contactar Soporte</a>
          </nav>
          <p style="color: #624242; opacity: 0.6; font-size: 10px;">
            © ${new Date().getFullYear()} HERBAURA BOTANICA. ELABORADO CON DEDICACIÓN.
          </p>
        </footer>
      </div>
    </div>
    `;

  try {
    const mailOptions = {
      from: `HerbAura Botanica <${process.env.EMAIL_USER}>`,
      to: toAddress,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
};
