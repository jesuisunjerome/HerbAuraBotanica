import { CART, formatCurrency } from "../../../lib/helper";
import { useCartStore } from "../../../store/useCartStore";

export default function CartSummary({ setCartStep }) {
  const { cart } = useCartStore();
  const IVA = 0.19; // 19% IVA
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * IVA;
  const shipping = cart.length > 0 ? 19.0 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="w-full md:w-4/12 xl:w-3/12 text-white">
      <div className="flex flex-col sticky top-20">
        <div className="p-7 lg:p-10 flex flex-col gap-10 bg-gray-700 rounded-2xl">
          <div>
            <div className="border-b border-white/10 pb-3 mb-5">
              <p className="text-xl">Resumen del Pedido</p>
            </div>
            <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
              <span>IVA (19%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
              <span>Envío</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between my-8 border-t border-white/10 pt-3">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-gray-100 flex flex-col gap-6">
          <div className="flex gap-2 items-center text-sm">
            {CART.PAYMENT_METHODS.map((method) => (
              <div
                className={`w-1/${CART.PAYMENT_METHODS.length} p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center`}
                key={method.id}
              >
                <img
                  src={method.img}
                  alt={method.name}
                  className="h-8 mx-auto object-contain"
                />
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => setCartStep(CART.STEPS.PAYMENT)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors"
            >
              Proceder al Pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
