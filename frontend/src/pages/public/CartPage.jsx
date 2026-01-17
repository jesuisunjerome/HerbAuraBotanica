import { useState } from "react";
import CartForm from "../../components/public/cart/CartForm";
import CartInfo from "../../components/public/cart/CartInfo";
import SEORender from "../../layouts/SEORender";
import { CART } from "../../lib/helper";

export default function CartPage() {
  const [cartStep, setCartStep] = useState(CART.STEPS.CART_INFO);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  return (
    <>
      <SEORender
        title="Carrito de Compras :: HerbAura Botanica"
        description="Revisa y gestiona los productos en tu carrito de compras en HerbAura Botanica. Tu camino hacia un cabello natural y saludable comienza aquí."
      />

      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        {cartStep === CART.STEPS.CART_INFO ? (
          <CartInfo setCartStep={setCartStep} />
        ) : (
          <>
            <CartForm
              setCartStep={setCartStep}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          </>
        )}
      </section>
    </>
  );
}
