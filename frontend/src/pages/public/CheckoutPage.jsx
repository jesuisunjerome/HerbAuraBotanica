import { ChevronLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import NoData from "../../components/common/NoData";
import SEORender from "../../components/common/SEORender";
import CheckoutForm from "../../components/public/checkout/CheckoutForm";
import { useCartStore } from "../../store/useCartStore";

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const navigate = useNavigate();

  return (
    <>
      <SEORender
        title="Checkout :: HerbAura Botanica"
        description="Finaliza tu compra en HerbAura Botanica. Revisa tu carrito, proporciona tu información de envío y elige tu método de pago para completar tu pedido."
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        {cart.length > 0 ? (
          <CheckoutForm />
        ) : (
          <div className="w-full md:w-8/12 xl:w-9/12 p-5 mx-auto rounded-2xl">
            <div className="mb-5 text-center">
              <button
                onClick={() => navigate("/products")}
                className="text-amber-600 hover:underline inline-flex items-center gap-1 group"
              >
                <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
                <span>Volver a Productos</span>
              </button>
            </div>

            <NoData
              img="/images/empty-cart.png"
              message="Tu carrito está vacío."
            />

            <div className="text-center mt-5">
              <p className="text-sm text-gray-600">
                ¿Necesitas ayuda? Revisa nuestro{" "}
                <Link to="/help" className="text-amber-600 hover:underline">
                  Centro de Ayuda
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
