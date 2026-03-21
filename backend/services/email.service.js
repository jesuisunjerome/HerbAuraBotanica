import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuración del transporte de correo utilizando Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD, // Utiliza una contraseña de aplicación generada en tu cuenta de Google
  },
});

export const sendOrderConfirmationEmail = async (order, type = "client") => {
  const isAdminEmail = type === "admin";
  const toAddress = isAdminEmail
    ? process.env.EMAIL_USER
    : order.shippingDetails.user.email;
  const subject = isAdminEmail
    ? "Nuevo pedido recibido - Detalles del cliente"
    : "Confirmación de tu pedido en HerbAura Botánica";

  const itemsListHtml = order.orderItems
    .map(
      (item) => `
          <div
              style="
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                gap: 16px;
              ">
              <div
                style="
                  width: 80px;
                  height: 96px;
                  border-radius: 8px;
                  overflow: hidden;
                  flex-shrink: 0;
                  background-color: #f4f3f1;
                ">
                <img
                  style="width: 100%; height: 100%; object-fit: cover"
                  data-alt="${item.name}"
                  src="${item.image}" />
              </div>
              <div style="flex-grow: 1">
                <h4 style="font-size: 18px; color: #275336">
                  ${item.name}
                </h4>
                <p
                  style="font-size: 14px; color: #414942"
                  class="text-sm text-on-surface-variant">
                  ${item.description}
                </p>
                <small style="font-size: 12px; color: #414942">
                  Cantidad: <strong>${item.quantity}</strong></small
                >
              </div>
              <span style="font-weight: 700; color: #624242">$${item.price.toFixed(2)}</span>
            </div>
        `,
    )
    .join("");

  const calculationDetailsHtml = `
    <div style="padding-top: 32px; border-top: 1px solid #c1c9bf1d">
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 8px;
              ">
              <span style="color: #414942">Subtotal</span>
              <span style="font-weight: 500">$${order.totalAmount.toFixed(2)}</span>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 8px;
              ">
              <span style="color: #414942">Envío</span>
              <span style="font-weight: 500">$${order.totalAmount.toFixed(2)}</span>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 8px;
              ">
              <span style="color: #414942">Impuestos</span>
              <span style="font-weight: 500">$${order.totalAmount.toFixed(2)}</span>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 20px;
                padding-top: 10px;
                color: #275336;
              ">
              <span>Total</span>
              <span>$${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
    `;

  const shippingDetailsHtml = `
    <div style="display: flex; gap: 24px; margin-bottom: 24px">
          <!-- Shipping Info Card -->
          <div
            style="
              flex: 1;
              background-color: #f4f3f1;
              padding: 24px;
              border-radius: 12px;
            ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style="color: #275336"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M1 3h15v13H1z"></path>
              <path d="M16 8h4l3 3v5h-7z"></path>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>

            <h5
              style="
                margin-block: 12px;
                font-weight: 700;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #964900;
              ">
              ENVIAR A:
            </h5>
            <address
              style="
                font-style: normal;
                font-size: 14px;
                color: #414942;
                line-height: 1.5;
              ">
              ${order.shippingDetails.user.address},<br />
              ${order.shippingDetails.user.city}, ${order.shippingDetails.user.state} ${order.shippingDetails.user.postalCode},<br />
              ${order.shippingDetails.user.country}
            </address>
          </div>
          <!-- Payment Info Card -->
          <div
            style="
              flex: 1;
              background-color: #f4f3f1;
              padding: 24px;
              border-radius: 12px;
            ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style="color: #275336"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>

            <h5
              style="
                margin-block: 12px;
                font-weight: 700;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #964900;
              ">
              INFO de PAGO:
            </h5>
            <p style="font-size: 14px; color: #414942; line-height: 1.5">
              ${order.paymentMethod}
            </p>
          </div>
        </div>
        `;

  const html = `
        <div
          style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #1a1c1b; background-color: #faf9f7;
          max-width: 672px;
          margin: 0 auto;">
         <!-- TopAppBar Navigation Shell -->
    <header style="padding-block: 32px">
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-inline: 24px;
        ">
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          ">
          <img
            alt="HerbAura Botanica Logo"
            style="height: 80px; width: auto"
            src="https://herbaurabotanica-front.onrender.com/logos/logo.png" />
        </div>
      </div>
    </header>
    <main
      style="
        width: 100%;
        padding-inline: 24px;
      ">
      <!-- Hero Confirmation Section -->
      <section style="text-align: center; margin-bottom: 64px">
        <span
          style="
            color: #964900;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 16px;
            display: block;
          "
          >${isAdminEmail ? "Resumen de venta" : "¡Gracias por tu compra!"}</span
        >
        <h2
          style="
            font-size: 36px;
            letter-spacing: 0.1em;
            margin-bottom: 24px;
            line-height: 1.25;
          ">
          Tus tesoros botánicos se están preparando.
        </h2>
        <p style="max-width: 448px; margin: 0 auto; color: #414942">
          El pedido <strong>#${order.confirmationNumber}</strong> ha sido confirmado y actualmente
          está siendo preparado con dedicación en nuestro taller.
        </p>
      </section>
      <!-- Main Content Card -->
      <div
        style="
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 24px;
        ">
        <!-- Order Summary Section -->
        <div style="background-color: #fff; border-radius: 12px; padding: 32px">
          <h3 style="margin-bottom: 32px; font-size: 24px; color: #624242">
            Resumen del Pedido
          </h3>
          ${itemsListHtml}
${calculationDetailsHtml}
        </div>
${shippingDetailsHtml}
 <!-- CTA -->
        <div>
          <a
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              gap: 8px;
              color: #fff;
              text-align: center;
              padding-block: 16px;
              border-radius: 12px;
              font-weight: 700;
              letter-spacing: 0.025em;
              background-color: #964900;
              text-decoration: none;
            "
            href="${process.env.CLIENT_URL}/track/${order.confirmationNumber}"
            >Rastrear Pedido
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
        </div>
      <!-- Secondary Content Section -->
      <section
        style="margin-top: 80px; display: flex; gap: 48px; align-items: center">
        <div style="flex: 1">
          <img
            style="border-radius: 12px; width: 100%; height: 320px; object-fit: cover;"
            data-alt="Unboxing experience with botanical products in a rustic setting"
            src="https://herbaurabotanica-front.onrender.com/images/7.png" />
        </div>
        <div style="flex: 1">
          <div style="margin-bottom: 24px">
            <h3 style="font-size: 30px; color: #275336">
              El Ritual de Recepción
            </h3>
            <p style="color: #414942; line-height: 1.625">
              Nuestro empaque está diseñado para ser una extensión sensorial del
              bosque. Cada caja es libre de plástico e infundida con el sutil
              aroma de la madera de cedro. Te invitamos a reutilizar los envases
              de vidrio una vez que estén vacíos.
            </p>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <span
              style="
                color: #244f33;
                padding-inline: 16px;
                padding-block: 4px;
                border-radius: 20px;
                background-color: #a2d2ac;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                font-size: 10px;
              "
              >ORGÁNICO</span
            >
            <span
              style="
                color: #244f33;
                padding-inline: 16px;
                padding-block: 4px;
                border-radius: 20px;
                background-color: #a2d2ac;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                font-size: 10px;
              "
              >ÉTICO</span
            >
            <span
              style="
                color: #244f33;
                padding-inline: 16px;
                padding-block: 4px;
                border-radius: 20px;
                background-color: #a2d2ac;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                font-size: 10px;
              "
              >SOSTENIBLE</span
            >
          </div>
        </div>
      </section>
    </main>
  <!-- Footer -->
    <footer
      style="
        background-color: #f4f3f1;
        margin-top: 48px;
        padding-block: 48px;
        padding-inline: 24px;
      ">
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          text-align: center;
        ">
        <div>
          <h4 style="font-size: 18px; color: #275336">HerbAura Botanica</h4>
          <h4 class="font-newsreader text-[#275336]">
            Where herbs nuture your hair's aura
          </h4>
        </div>
        <nav
          style="
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          ">
          <a
            style="
              font-size: 14px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #624242;
              text-decoration: none;
              transition: color 0.3s;
            "
            href="${process.env.CLIENT_URL}/track/${order.confirmationNumber}"
            >RASTREAR PEDIDO</a
          >
          <a
            style="
              font-size: 14px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #624242;
              text-decoration: none;
              transition: color 0.3s;
            "
            href="${process.env.CLIENT_URL}/shipping-policy"
            >POLÍTICA DE ENVÍO</a
          >
          <a
            style="
              font-size: 14px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #624242;
              text-decoration: none;
              transition: color 0.3s;
            "
            href="${process.env.CLIENT_URL}/sustainability"
            >SOSTENIBILIDAD</a
          >
          <a
            style="
              font-size: 14px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #624242;
              text-decoration: none;
              transition: color 0.3s;
            "
            href="${process.env.CLIENT_URL}/support"
            >CONTACTAR SOPORTE</a
          >
        </nav>
        <div
          style="
            padding-top: 32px;
            border-top: 1px solid #c1c9bf1d;
            width: 100%;
          ">
          <p
            style="
              font-size: 12px;
              letter-spacing: 0.025em;
              text-transform: uppercase;
              color: #624242;
              opacity: 0.6;
            ">
            © ${new Date().getFullYear()} HERBAURA BOTANICA. ELABORADO CON
            DEDICACIÓN.
          </p>
        </div>
      </div>
    </footer>
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
