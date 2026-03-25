import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const elementOptions = {
  appearance: {
    theme: "stripe",
    variables: {
      colorPrimary: "#000000",
      colorBackground: "#ffffff",
      colorText: "#000000",
    },
  },
};

export default function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise} options={elementOptions}>
      {children}
    </Elements>
  );
}
