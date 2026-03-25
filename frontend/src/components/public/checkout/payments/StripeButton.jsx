import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { ORDER_API_CREATE_ORDER } from "../../../../hooks/orders/mutations";
import { COUNTRY_LIST } from "../../../../lib/helper";
import { useCartStore } from "../../../../store/useCartStore";

export default function StripeButton({ formData, disabled, onSuccess }) {
  const stripe = useStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, clearCart } = useCartStore();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const selectedCountry = COUNTRY_LIST.find(
        (c) => c.value === formData.shippingAddress.country,
      )?.label;

      // 1. Create order in backend and get client secret
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

      // 2. Confirm card payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        stripeClientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.customer.name,
              email: formData.customer.email,
              phone: formData.customer.phone,
              address: {
                line1: formData.shippingAddress.address,
                city: formData.shippingAddress.city,
                state: formData.shippingAddress.state,
                postal_code: formData.shippingAddress.postalCode,
                country: formData.shippingAddress.country,
              },
            },
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      // 3. Handle successful payment
      if (paymentIntent.status === "succeeded") {
        clearCart();
        onSuccess(order._id);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error en el pago: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
          Información de Tarjeta
        </label>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
              hidePostalCode: true, // We already collect this in our form
            }}
          />
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={disabled || isProcessing || !stripe}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-3"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full font-bold"></span>
              Procesando Pago...
            </>
          ) : (
            "Pagar"
          )}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-3 h-3"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pagos seguros encriptados por Stripe
      </p>
    </div>
  );
}
