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
