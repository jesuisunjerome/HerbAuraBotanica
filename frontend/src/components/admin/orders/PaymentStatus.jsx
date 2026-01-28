import { formatCurrency, IVA_RATE, SHIPPING_COST } from "../../../lib/helper";

export default function PaymentStatus({ order, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Estado de Pago</p>
      </div>
      {isPending ? (
        <PaymentStatusSkeleton />
      ) : (
        <div className="py-3 space-y-1 divide-y divide-gray-100">
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-sm text-gray-500">
              {order.orderItems.length} artículos
            </p>
            <p className="text-sm font-medium">
              {formatCurrency(
                order.orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
              )}
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500">Envío</p>
            <p className="text-sm text-gray-500">Express</p>
            <p className="text-sm font-medium">
              {formatCurrency(SHIPPING_COST)}
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-sm text-gray-500">
              Impuestos ({IVA_RATE * 100}%)
            </p>
            <p className="text-sm font-medium">
              {formatCurrency(
                order.orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity * IVA_RATE,
                  0,
                ),
              )}
            </p>
          </div>
          <div className="pt-3 flex justify-between">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">
              {formatCurrency(order.totalAmount)}
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
