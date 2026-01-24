import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalButton({ amount, onSuccess, onError }) {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const options = {
    "client-id": clientId,
    currency: "MXN",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: options.currency,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}
