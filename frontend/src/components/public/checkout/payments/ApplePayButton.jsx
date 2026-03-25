import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ORDER_API_CREATE_ORDER } from "../../../../hooks/orders/mutations";
import { COUNTRY_LIST } from "../../../../lib/helper";
import { useCartStore } from "../../../../store/useCartStore";

export default function ApplePayButton({ formData, disabled, onSuccess }) {
  const stripe = useStripe();
  const { cart, getCartTotalWithIVA, clearCart } = useCartStore();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canPay, setCanPay] = useState(false);

  const total = getCartTotalWithIVA();

  const createPaymentRequest = () => {
    if (!stripe || total <= 0 || disabled) return;

    const pr = stripe.paymentRequest({
      country: "MX",
      currency: "mxn",
      total: {
        label: "HerbAura Botanica",
        amount: Math.round(total * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: false,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanPay(true);
      }
    });

    pr.on("paymentmethod", async (event) => {
      try {
        if (!formData?.customer?.email || !formData?.shippingAddress?.address) {
          toast.error("Faltan datos del cliente o dirección de envío");
          event.complete("fail");
          return;
        }

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

        const { order, stripeClientSecret } =
          await ORDER_API_CREATE_ORDER(orderPayload);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          stripeClientSecret,
          {
            payment_method: event.paymentMethod.id,
          },
          {
            handleActions: false,
          },
        );

        if (error) {
          event.complete("fail");
          toast.error("Error al procesar el pago");
          console.error("Apple Pay payment error:", error);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          event.complete("success");
          clearCart();
          onSuccess?.(order._id);
        } else if (paymentIntent.status === "requires_action") {
          event.complete("success");
          const { error: actionError, paymentIntent: newPaymentIntent } =
            await stripe.confirmCardPayment(stripeClientSecret);

          if (actionError) {
            throw new Error(actionError.message);
          }

          if (newPaymentIntent.status === "succeeded") {
            clearCart();
            onSuccess?.(order._id);
          } else {
            throw new Error("Payment failed after additional authentication");
          }
        } else {
          event.complete("fail");
          throw new Error(
            "Payment failed with status: " + paymentIntent.status,
          );
        }
      } catch (error) {
        event.complete("fail");
        toast.error("Error al validar los datos del cliente");
        console.error("Apple Pay payment error:", error);
        return;
      }
    });
  };

  useEffect(() => {
    createPaymentRequest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!canPay) {
    return (
      <p className="text-center text-slate-400 text-sm py-2">
        Apple Pay no está disponible en este dispositivo o navegador.
      </p>
    );
  }

  return (
    <div className="w-full">
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: "buy",
              theme: "dark",
              height: "48px",
            },
          },
        }}
      />
    </div>
  );
}
