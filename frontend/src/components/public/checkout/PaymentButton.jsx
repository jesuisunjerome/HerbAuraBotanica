import ApplePayButton from "./payments/ApplePayButton";
import MercadoPagoButton from "./payments/MercadoPagoButton";
import PayPalButton from "./payments/PayPalButton";
import StripeButton from "./payments/StripeButton";

export default function PaymentButton({
  paymentMethod,
  formData,
  disabled,
  onSuccess,
}) {
  switch (paymentMethod) {
    case "PayPal":
      return (
        <PayPalButton
          formData={formData}
          disabled={disabled}
          onSuccess={onSuccess}
        />
      );
    case "Mercado Pago":
      return (
        <MercadoPagoButton
          formData={formData}
          disabled={disabled}
          onSuccess={onSuccess}
        />
      );
    case "Stripe":
      return (
        <StripeButton
          formData={formData}
          disabled={disabled}
          onSuccess={onSuccess}
        />
      );
    case "Apple Pay":
      return (
        <ApplePayButton
          formData={formData}
          disabled={disabled}
          onSuccess={onSuccess}
        />
      );
    default:
      return null;
  }
}
