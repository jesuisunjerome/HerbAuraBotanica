import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "../../../store/useCartStore";
import NoData from "../../common/NoData";
import CartTable from "./CartTable";

export default function CartList() {
  const { cart, clearCart } = useCartStore();

  return (
    <div className="w-full md:w-8/12 xl:w-9/12 p-5 rounded-2xl">
      {cart.length === 0 && (
        <NoData img="/images/empty-cart.png" message="Tu carrito está vacío." />
      )}

      {cart.map((item) => (
        <CartTable key={item._id} item={item} />
      ))}

      <div className="flex flex-wrap gap-4 items-center justify-between mt-10">
        <p className="text-sm text-gray-600">
          ¿Necesitas ayuda? Revisa nuestro{" "}
          <Link to="/help" className="text-amber-600 hover:underline">
            Centro de Ayuda
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <Link
            to="/products"
            className="border border-gray-600 text-gray-600 px-5 py-2 rounded group hover:text-white hover:bg-gray-700 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 justify-center"
          >
            <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-2 transition-all" />
            <span>Volver</span>
          </Link>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="border bg-red-50 border-red-300 text-red-500 px-5 py-2 rounded group hover:text-gray-700 hover:bg-red-300 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              <span>Vaciar Carrito</span>
              <TrashIcon className="h-5 w-5 group-hover:translate-x-2 transition-all" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
