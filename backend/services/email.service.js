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
            $${item.price.toFixed(2)} MXN
          </td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #364153; background-color: #f9f9f9; padding:15px">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 10px; border-radius: 8px;">
        <header style="text-align: center; margin-bottom: 20px; padding-top:20px">
          <img alt="HerbAura Botanica Logo" height="80" src="https://herbaurabotanica-front.onrender.com/logos/logo.png" style="height: 80px; object-fit: contain; display: block; margin: 0 auto;" />
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
                <td style="padding: 15px; padding-bottom: 5px;">
                  Subtotal
                </td>
                <td style="padding: 15px; padding-bottom: 5px;"></td>
                <td style="padding: 15px; padding-bottom: 5px;">$${order?.totalAmount?.toFixed(2)} MXN</td>
              </tr>
              <tr>
                <td style="padding: 10px; padding-bottom: 5px;">
                  IVA (19%)
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${(order?.totalAmount * 0.19).toFixed(2)} MXN</td>
              </tr>
              <tr>
                <td style="padding: 10px; padding-bottom: 5px;">
                  Envío
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.shippingCost?.toFixed(2)} MXN</td>
              </tr>
              <tr style="font-weight: 700;">
                <td style="padding: 10px; padding-bottom: 5px;">
                  Total
                </td>
                <td style="padding: 10px; padding-bottom: 5px;"></td>
                <td style="padding: 10px; padding-bottom: 5px;">$${order?.totalAmount?.toFixed(2)} MXN</td>
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
                    ${order.shippingDetails.user.address},<br />
                    ${order.shippingDetails.user.city}, ${order.shippingDetails.user.state} ${order.shippingDetails.user.postalCode},<br />
                    ${order.shippingDetails.user.country}
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
                  <img src="https://herbaurabotanica-front.onrender.com/images/7.png" alt="Unboxing experience with botanical products in a rustic setting" style="width: 100%; height: 290px; background-color: #e5e7eb2e; border-radius: 8px; object-fit: cover;" />
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

// export const sendOrderConfirmationEmail1 = async (order, type = "client") => {
//   const isAdminEmail = type === "admin";
//   const toAddress = isAdminEmail
//     ? process.env.EMAIL_USER
//     : order.shippingDetails.user.email;
//   const subject = isAdminEmail
//     ? "Nuevo pedido recibido - Detalles del cliente"
//     : "Confirmación de tu pedido en HerbAura Botánica";

//   const itemsListHtml = order.orderItems
//     .map(
//       (item) => `
//               <tr style="margin-bottom:24px>
//                 <!-- Columna 1: Imagen -->
//                 <td style="width: 80px; height: 86px;border-radius: 8px; overflow: hidden">
//                   <img
//                     src="${item.image}"
//                     alt="${item.name}"
//                     width= "80";
//                     height= "86";
//                     style="width: 80px; height: 86px;  object-fit: cover;border-radius: 8px; padding:12px; background-color: #f3f4f6;" />
//                 </td>

//                 <!-- Columna 2: Información -->
//                 <td style="padding-left: 18px; vertical-align: top">
//                   <h5 style="color: #275336; margin: 0">
//                     ${item.name}
//                   </h5>

//                   <small style="color: #414942; display: block; margin-bottom: 8px">
//                     ${item.quantity} x $${item.price.toFixed(2)}MXN
//                   </small>
//                 </td>

//                 <!-- Columna 3: Precio -->
//                 <td
//                   style="font-weight: 700; color: #624242; padding-left: 18px">
//                   $${item.price.toFixed(2)}MXN
//                 </td>
//               </tr>
//         `,
//     )
//     .join("");

//   const calculationDetailsHtml = `
//             <tr style="padding-top: 24px; border-top: 1px solid #c1c9bf1d">
//               <td>
//               <small style="color: #414942">Subtotal</small>
//              </td>
//              <td></td>
//              <td>
//               <small style="font-weight: 500">$${order.totalAmount.toFixed(2)}MXN</small>
//             </td>
//               </tr>
//             <tr>
//             <td>
//               <small style="color: #414942">Envío</small>
//               </td>
//              <td></td>
//               <td>
//               <small style="font-weight: 500">$${order.totalAmount.toFixed(2)}MXN</small>
//            </td>
//               </tr>
//             <tr>
//               <td>
//                 <small style="color: #414942">Impuestos</small>
//               </td>
//              <td></td>
//               <td>
//                 <small style="font-weight: 500">$${order.totalAmount.toFixed(2)}MXN</small>
//               </td>
//             </tr>
//             <tr style="color: #414942";font-weight:500">
//               <td>
//               Total
//               </td>
//              <td></td>
//               <td>
//                 $${order.totalAmount.toFixed(2)}MXN
//               </td>
//             </tr>
//         `;

//   const shippingDetailsHtml = `
//     <div style="display: flex; gap: 24px; margin-bottom: 24px">
//           <!-- Shipping Info Card -->
//           <div
//             style="
//               flex: 1;
//               background-color: #f4f3f1;
//               padding: 24px;
//               border-radius: 12px;
//             ">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               style="color: #275336"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round">
//               <path d="M1 3h15v13H1z"></path>
//               <path d="M16 8h4l3 3v5h-7z"></path>
//               <circle cx="5.5" cy="18.5" r="2.5"></circle>
//               <circle cx="18.5" cy="18.5" r="2.5"></circle>
//             </svg>

//             <h5
//               style="
//                 margin-block: 12px;
//                 font-weight: 700;
//                 text-transform: uppercase;
//                 letter-spacing: 0.05em;
//                 color: #964900;
//               ">
//               ENVIAR A:
//             </h5>
//             <address
//               style="
//                 font-style: normal;
//                 color: #414942;
//                 line-height: 1.5;
//               ">
//               ${order.shippingDetails.user.address},<br />
//               ${order.shippingDetails.user.city}, ${order.shippingDetails.user.state} ${order.shippingDetails.user.postalCode},<br />
//               ${order.shippingDetails.user.country}
//             </address>
//           </div>
//           <!-- Payment Info Card -->
//           <div
//             style="
//               flex: 1;
//               background-color: #f4f3f1;
//               padding: 24px;
//               border-radius: 12px;
//             ">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               style="color: #275336"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round">
//               <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
//               <line x1="1" y1="10" x2="23" y2="10"></line>
//             </svg>

//             <h5
//               style="
//                 margin-block: 12px;
//                 font-weight: 700;
//                 text-transform: uppercase;
//                 letter-spacing: 0.05em;
//                 color: #964900;
//               ">
//               INFO de PAGO:
//             </h5>
//             <p style="color: #414942; line-height: 1.5">
//               ${order.paymentMethod}
//             </p>
//           </div>
//         </div>
//         `;

//   const html = `
//   <div style="background-color: #faf9f7">
//     <div
//       style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #1a1c1b;
//       max-width: 600px;
//       margin: 0 auto;">
//       <!-- TopAppBar Navigation Shell -->
//     <header style="width:100%; padding: 24px; text-align:center">
//           <img
//             alt="HerbAura Botanica Logo"
//             height="80"
//             style="height: 80px; object-fit: contain"
//             src="https://herbaurabotanica-front.onrender.com/logos/logo.png" />
//     </header>
//     <main
//       style="
//         width: 100%;
//         padding-left: 24px;
//         padding-right: 24px;
//       ">
//       <!-- Hero Confirmation Section -->
//       <section style="text-align: center; margin-bottom: 64px">
//         <span
//           style="
//             color: #964900;
//             letter-spacing: 0.1em;
//             text-transform: uppercase;
//             font-weight: bold;
//             margin-bottom: 16px;
//             display: block;
//           "
//           >${isAdminEmail ? "Resumen de venta" : "¡Gracias por tu compra!"}</span
//         >
//         <h2
//           style="
//             letter-spacing: 0.1em;
//             margin-bottom: 24px;
//             line-height: 1.25;
//           ">
//           Tus tesoros botánicos se están preparando.
//         </h2>
//         <p style="max-width: 448px; margin: 0 auto; color: #414942">
//           El pedido <strong>#${order.confirmationNumber}</strong> ha sido confirmado y actualmente
//           está siendo preparado con dedicación en nuestro taller.
//         </p>
//       </section>
//       <!-- Main Content Card -->
//       <div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 24px;">
//         <!-- Order Summary Section -->
//         <div style="background-color: #fff; border-radius: 12px; padding: 32px; margin-bottom: 24px">
//           <h3 style="margin-bottom: 24px; color: #624242">
//             Resumen del Pedido
//           </h3>
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px">
//           ${itemsListHtml}
//           ${calculationDetailsHtml}
//             </table>
//         </div>
// ${shippingDetailsHtml}
//  <!-- CTA -->
//         <div>
//           <a
//             style="
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               width: 100%;
//               gap: 8px;
//               color: #fff;
//               text-align: center;
//               padding-block: 16px;
//               border-radius: 12px;
//               font-weight: 700;
//               letter-spacing: 0.025em;
//               background-color: #964900;
//               text-decoration: none;
//             "
//             href="${process.env.CLIENT_URL}/track/${order.confirmationNumber}"
//             >Rastrear Pedido
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round">
//               <line x1="5" y1="12" x2="19" y2="12"></line>
//               <polyline points="12 5 19 12 12 19"></polyline>
//             </svg>
//           </a>
//         </div>
//         </div>
//       <!-- Secondary Content Section -->
//       <section
//         style="margin-top: 80px; display: flex; gap: 48px; align-items: center">
//         <div style="flex: 1">
//           <img
//             style="border-radius: 12px; width: 100%; height: 320px; object-fit: cover;"
//             data-alt="Unboxing experience with botanical products in a rustic setting"
//             src="https://herbaurabotanica-front.onrender.com/images/7.png" />
//         </div>
//         <div style="flex: 1">
//           <div style="margin-bottom: 24px">
//             <h3 style="color: #275336">
//               El Ritual de Recepción
//             </h3>
//             <p style="color: #414942; line-height: 1.625">
//               Nuestro empaque está diseñado para ser una extensión sensorial del
//               bosque. Cada caja es libre de plástico e infundida con el sutil
//               aroma de la madera de cedro. Te invitamos a reutilizar los envases
//               de vidrio una vez que estén vacíos.
//             </p>
//           </div>
//           <div style="display: flex; flex-wrap: wrap; gap: 8px">
//             <span
//               style="
//                 color: #244f33;
//                 padding-inline: 16px;
//                 padding-block: 4px;
//                 border-radius: 20px;
//                 background-color: #a2d2ac;
//                 font-weight: 700;
//                 letter-spacing: 0.1em;
//                 text-transform: uppercase;
//                 font-size: 10px;
//               "
//               >ORGÁNICO</span
//             >
//             <span
//               style="
//                 color: #244f33;
//                 padding-inline: 16px;
//                 padding-block: 4px;
//                 border-radius: 20px;
//                 background-color: #a2d2ac;
//                 font-weight: 700;
//                 letter-spacing: 0.1em;
//                 text-transform: uppercase;
//                 font-size: 10px;
//               "
//               >ÉTICO</span
//             >
//             <span
//               style="
//                 color: #244f33;
//                 padding-inline: 16px;
//                 padding-block: 4px;
//                 border-radius: 20px;
//                 background-color: #a2d2ac;
//                 font-weight: 700;
//                 letter-spacing: 0.1em;
//                 text-transform: uppercase;
//                 font-size: 10px;
//               "
//               >SOSTENIBLE</span
//             >
//           </div>
//         </div>
//       </section>
//     </main>
//   <!-- Footer -->
//     <footer
//       style="
//         background-color: #f4f3f1;
//         margin-top: 48px;
//         padding-block: 48px;
//         padding-inline: 24px;
//       ">
//       <div
//         style="
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 24px;
//           width: 100%;
//           text-align: center;
//         ">
//         <div>
//           <h4 style="color: #275336">HerbAura Botanica</h4>
//           <h4 style="color: #275336">
//             Where herbs nuture your hair's aura
//           </h4>
//         </div>
//         <nav
//           style="
//             display: flex;
//             flex-wrap: wrap;
//             justify-content: center;
//             gap: 16px;
//           ">
//           <a
//             style="
//               letter-spacing: 0.05em;
//               text-transform: uppercase;
//               color: #624242;
//               text-decoration: none;
//               transition: color 0.3s;
//             "
//             href="${process.env.CLIENT_URL}/track/${order.confirmationNumber}"
//             >RASTREAR PEDIDO</a
//           >
//           <a
//             style="
//               letter-spacing: 0.05em;
//               text-transform: uppercase;
//               color: #624242;
//               text-decoration: none;
//               transition: color 0.3s;
//             "
//             href="${process.env.CLIENT_URL}/shipping-policy"
//             >POLÍTICA DE ENVÍO</a
//           >
//           <a
//             style="
//               letter-spacing: 0.05em;
//               text-transform: uppercase;
//               color: #624242;
//               text-decoration: none;
//               transition: color 0.3s;
//             "
//             href="${process.env.CLIENT_URL}/sustainability"
//             >SOSTENIBILIDAD</a
//           >
//           <a
//             style="
//               letter-spacing: 0.05em;
//               text-transform: uppercase;
//               color: #624242;
//               text-decoration: none;
//               transition: color 0.3s;
//             "
//             href="${process.env.CLIENT_URL}/support"
//             >CONTACTAR SOPORTE</a
//           >
//         </nav>
//         <div
//           style="
//             padding-top: 32px;
//             border-top: 1px solid #c1c9bf1d;
//             width: 100%;
//           ">
//           <p
//             style="
//               letter-spacing: 0.025em;
//               text-transform: uppercase;
//               color: #624242;
//               opacity: 0.6;
//             ">
//             © ${new Date().getFullYear()} HERBAURA BOTANICA. ELABORADO CON
//             DEDICACIÓN.
//           </p>
//         </div>
//       </div>
//     </footer>
//           </div>
//           </div>
//           `;

//   try {
//     const mailOptions = {
//       from: `HerbAura Botanica <${process.env.EMAIL_USER}>`,
//       to: toAddress,
//       subject,
//       html,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Correo electrónico enviado exitosamente");
//   } catch (error) {
//     console.error("Error al enviar el correo electrónico:", error);
//   }
// };
