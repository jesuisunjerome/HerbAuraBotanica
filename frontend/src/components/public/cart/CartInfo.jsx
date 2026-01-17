import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "../../../store/useCartStore";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

export default function CartInfo({ setCartStep }) {
  const { cart } = useCartStore();

  return (
    <>
      <div className="mb-5">
        <Link
          to="/products"
          className="text-amber-600 hover:underline flex items-center gap-1 group"
        >
          <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
          <span>Volver a Productos</span>
        </Link>
      </div>

      {cart.length > 0 && (
        <h1 className="text-2xl lg:text-3xl mb-3 lg:mb-5">
          Tu Carrito de Compras
        </h1>
      )}
      <div className="flex flex-col md:flex-row gap-10 xl:gap-20">
        <CartList />
        <CartSummary setCartStep={setCartStep} />
      </div>
    </>
  );
}
