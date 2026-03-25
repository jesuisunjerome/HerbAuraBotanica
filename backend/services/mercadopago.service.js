import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/**
 * Get payment details from Mercado Pago using the payment ID.
 */
export async function getMercadoPagoPaymentDetails(paymentId) {
  try {
    const payment = new Payment(client);
    console.log(
      "getMercadoPagoPaymentDetails called with paymentId:",
      paymentId,
    );
    const response = await payment.get({ id: paymentId });
    console.log("getMercadoPagoPaymentDetails response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching Mercado Pago payment details:", error);
    throw error;
  }
}

/**
 * Create a Mercado Pago preference for a given order, which will be used to initiate the payment process on the frontend.
 */
export async function createMercadoPagoPreference(order, orderItems) {
  try {
    const preference = new Preference(client);

    const items = orderItems.map((item) => ({
      id: item.product.toString(),
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "MXN",
    }));

    console.log("createMercadoPagoPreference items:", items);

    const response = await preference.create({
      body: {
        items,
        shipments: {
          cost: order.shippingPrice,
          mode: "not_specified",
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/order-confirmation/${order._id}?status=success`,
          failure: `${process.env.FRONTEND_URL}/order-confirmation/${order._id}?status=failure`,
          pending: `${process.env.FRONTEND_URL}/order-confirmation/${order._id}?status=pending`,
        },
        auto_return: "approved",
        // redirectMode:"modal",
        notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`,
        external_reference: order._id.toString(),
        metadata: {
          orderId: order._id.toString(),
        },
      },
    });

    return {
      preferenceId: response.id, // ID of the created preference
      initPoint: response.init_point, // URL to redirect the user to start the payment process
      sandboxInitPoint: response.sandbox_init_point, // For testing in sandbox mode
    };
  } catch (error) {
    console.error("Error creating Mercado Pago preference:", error);
    throw error;
  }
}
