import { formatCurrency, IVA_RATE } from "../../../lib/helper";

export default function PaymentStatus({ order, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-bold">Estado de Pago</p>
      </div>
      {isPending ? (
        <PaymentStatusSkeleton />
      ) : (
        <div className="py-3 space-y-1 divide-y divide-gray-100">
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500 font-medium">Subtotal</p>
            <p className="text-sm text-gray-500 font-medium">
              {order.orderItems.length} artículos
            </p>
            <p className="text-sm font-semibold">
              {formatCurrency(order.itemsPrice)}
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500 font-medium">Envío</p>
            <p className="text-sm text-gray-500 font-medium">Express</p>
            <p className="text-sm font-semibold">
              {formatCurrency(order.shippingPrice)}
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500 font-medium">
              Impuestos ({IVA_RATE * 100}%)
            </p>
            <p className="text-sm font-semibold">
              {formatCurrency(order.taxPrice)}
            </p>
          </div>
          <div className="pt-3 flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold text-[#3f6b4c]">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentStatusSkeleton() {
  return (
    <div className="py-3 space-y-1 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex justify-between pb-1">
          <div className="bg-gray-50 h-4 w-50 rounded"></div>
          <div className="bg-gray-50 h-4 w-16 rounded"></div>
          <div className="bg-gray-50 h-4 w-20 rounded"></div>
        </div>
      ))}
    </div>
  );
}
