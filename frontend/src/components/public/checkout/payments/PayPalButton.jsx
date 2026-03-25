import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  useCaptureOrder,
  useCreateOrder,
} from "../../../../hooks/orders/mutations";
import { COUNTRY_LIST } from "../../../../lib/helper";
import { useCartStore } from "../../../../store/useCartStore";

export default function PayPalButton({ formData, disabled, onSuccess }) {
  const { cart, getCartTotalWithIVA, clearCart } = useCartStore();
  const total = getCartTotalWithIVA();

  const { isCreatingOrder, createOrder } = useCreateOrder();
  const { isCapturingOrder, captureOrder } = useCaptureOrder();

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const options = {
    "client-id": clientId,
    currency: "MXN",
    intent: "capture",
  };

  const handlePayment = async () => {
    const selectedCountry = COUNTRY_LIST.find(
      (c) => c.value === formData.shippingAddress.country,
    )?.label;

    const orderPayload = {
      orderItems: cart.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        image: item.images[0].url,
        price: item.price,
      })),
      customer: formData.customer,
      shippingAddress: {
        ...formData.shippingAddress,
        country: selectedCountry,
      },
      paymentMethod: formData.paymentMethod,
    };

    try {
      const { order, paypalOrderId } = await createOrder(orderPayload);
      window._currentOrderId = order._id; // Guardar el ID del pedido en una variable global
      return paypalOrderId;
    } catch (error) {
      console.error("Error al crear el pedido (PayPal):", error);
      throw error;
    }
  };

  const handleApprove = async (data) => {
    const orderId = window._currentOrderId; // Obtener el ID del pedido desde la variable global
    const paypalOrderId = data.orderID;

    try {
      await captureOrder(
        { orderId, paypalOrderId },
        {
          onSuccess: () => {
            clearCart();
            onSuccess(orderId);
          },
          onError: (error) => {
            console.error("Error al capturar el pedido (PayPal):", error);
          },
        },
      );
    } catch (error) {
      console.error("Error al capturar el pedido (PayPal):", error);
    }
  };

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        disabled={disabled || isCreatingOrder || isCapturingOrder || total <= 0}
        style={{ layout: "vertical" }}
        createOrder={handlePayment}
        onApprove={handleApprove}
        onError={(error) => {
          console.error("Error en el pago (PayPal):", error);
        }}
      />
    </PayPalScriptProvider>
  );
}
