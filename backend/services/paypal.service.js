const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL =
  // process.env.NODE_ENV === "production"
  //   ? "https://api-m.paypal.com" :
  "https://api-m.sandbox.paypal.com";

/**
 * Generate an OAuth 2.0 access token for PayPal API authentication.
 *  * @see https://developer.paypal.com/api/rest/authentication/
 */
async function generateAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "El ID de cliente y el secreto de PayPal deben configurarse en las variables de entorno.",
    );
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error al generar el token de acceso de PayPal: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
    );
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal order to start a payment process.
 */
export async function createPaypalOrder(totalAmount, orderId) {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "MXN",
            value: totalAmount.toFixed(2),
          },
          reference_id: orderId,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error al crear la orden de PayPal: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Capture a PayPal order after the buyer approves the payment.
 */
export async function capturePaypalOrder(paypalOrderId) {
  const accessToken = await generateAccessToken();
  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error al capturar la orden de PayPal: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
    );
  }

  const data = await response.json();
  return data;
}

export async function verifyPayPalWebhookSignature(req) {
  // Extract required headers
  const transmissionId = req.headers["paypal-transmission-id"];
  const transmissionTime = req.headers["paypal-transmission-time"];
  const certUrl = req.headers["paypal-cert-url"];
  const authAlgo = req.headers["paypal-auth-algo"];
  const transmissionSig = req.headers["paypal-transmission-sig"];
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig ||
    !webhookId
  ) {
    throw new Error("Faltan encabezados de webhook de PayPal o configuración");
  }

  // Ensure raw body is a string for verification
  const requestBody =
    typeof req.body === "object" && !(req.body instanceof Buffer)
      ? JSON.stringify(req.body)
      : req.body.toString();

  const accessToken = await generateAccessToken();

  const verificationResponse = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(requestBody),
      }),
    },
  );

  if (!verificationResponse.ok) {
    const err = await verificationResponse.text();
    throw new Error(`Error al verificar firma de webhook de PayPal: ${err}`);
  }

  const result = await verificationResponse.json();
  if (result.verification_status !== "SUCCESS") {
    throw new Error("Firma del webhook de PayPal inválida");
  }
  return true;
}
