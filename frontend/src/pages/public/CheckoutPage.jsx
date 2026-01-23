import CheckoutForm from "../../components/public/checkout/CheckoutForm";
import SEORender from "../../layouts/SEORender";

export default function CheckoutPage() {
  return (
    <>
      <SEORender
        title="Checkout :: HerbAura Botanica"
        description="Finaliza tu compra en HerbAura Botanica. Revisa tu carrito, proporciona tu información de envío y elige tu método de pago para completar tu pedido."
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        <CheckoutForm />
      </section>
    </>
  );
}
