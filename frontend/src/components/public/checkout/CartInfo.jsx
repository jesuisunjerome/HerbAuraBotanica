import { MinusIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { formatCurrency } from "../../../lib/helper";
import { useCartStore } from "../../../store/useCartStore";

export default function CartInfo({ showCart, handleToggleCart }) {
  const { cart, removeFromCart, decreaseQuantity, addToCart, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    handleToggleCart();
    navigate("/checkout");
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-dvh flex flex-col border-l border-gray-100 bg-white z-50 w-[80%] sm:w-md transition-transform duration-300 shadow-lg ${
        showCart ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between border-b border-b-gray-200 p-4">
        <h2 className="text-lg font-semibold">Carrito de Compras</h2>
        <button
          title="Cerrar carrito"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleToggleCart}
          aria-label="Cerrar carrito de compras"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="px-4 py-2 flex-1 overflow-auto">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cart.map((item) => (
            <div
              className="flex items-center justify-between py-3 border-b gap-2 border-gray-100"
              key={item._id}
            >
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 overflow-hidden rounded-xl p-2 shrink-0">
                  <img
                    loading="lazy"
                    src={item.images.find((img) => img.isMain)?.url}
                    className="w-17 h-17 object-contain bg-gray-100 rounded-xl"
                    alt={item.name}
                  />
                </div>
                <div>
                  <p className="font-medium leading-tight text-sm">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-sm leading-tight">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      title="Disminuir cantidad"
                      onClick={() => decreaseQuantity(item._id)}
                      className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
                    >
                      <MinusIcon className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      title="Aumentar cantidad"
                      onClick={() => addToCart(item)}
                      className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
                    >
                      <PlusIcon className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button
                  title="Eliminar producto"
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="sticky bottom-0 border-t border-gray-100 p-4">
          <button
            onClick={handleCheckout}
            className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
          >
            Proceder al Pago
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-2 border border-gray-200 text-gray-600 py-2 rounded hover:bg-gray-100 transition"
          >
            Vaciar Carrito
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center leading-tight tracking-tighter">
            Los gastos de envío se calcularán en la página de pago.
          </p>
        </div>
      )}
    </aside>
  );
}
