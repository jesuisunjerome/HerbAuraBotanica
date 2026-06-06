import { AlertTriangleIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdjustProductStock } from "../../hooks/products/mutations";
import {
  useFetchProducts,
  useInventoryHistory,
  useLowStockProducts,
} from "../../hooks/products/queries";

const movementOptions = [
  { value: "IN", label: "Entrada" },
  { value: "OUT", label: "Salida" },
];

export default function InventoryPage() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const { products = [], isPending: isLoadingProducts } = useFetchProducts({
    refetchInterval: 30000,
  });
  const { lowStockProducts = [] } = useLowStockProducts();
  const { history } = useInventoryHistory(selectedProductId, {
    page: 1,
    limit: 15,
  });
  const { isAdjustingStock, adjustProductStock } = useAdjustProductStock();

  const selectedProduct = useMemo(
    () => products.find((item) => item._id === selectedProductId),
    [products, selectedProductId],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedProductId) {
      return;
    }

    adjustProductStock(
      {
        productId: selectedProductId,
        movementType,
        quantity: Number(quantity),
        reason,
      },
      {
        onSuccess: () => {
          setReason("");
          setQuantity(1);
        },
      },
    );
  };

  return (
    <section className="space-y-6 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Control de inventario</h1>
        <p className="text-sm text-gray-600">
          Ajusta entradas y salidas de productos con historial auditable en
          tiempo real.
        </p>
      </div>

      <div className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
          <p className="font-semibold">Alertas de bajo inventario</p>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay productos con inventario bajo.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {lowStockProducts.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setSelectedProductId(item._id)}
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left transition hover:bg-amber-100"
              >
                <p className="font-medium text-amber-900">{item.name}</p>
                <p className="text-xs text-amber-800">
                  Stock: {item.stockQuantity} | Umbral: {item.lowStockThreshold}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">Registrar movimiento</h2>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Producto</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-md border border-[#3f6b4c]/25 px-3 py-2 text-sm"
                disabled={isLoadingProducts}
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.stockQuantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Tipo</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                  className="w-full rounded-md border border-[#3f6b4c]/25 px-3 py-2 text-sm"
                >
                  {movementOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-md border border-[#3f6b4c]/25 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Motivo</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-[#3f6b4c]/25 px-3 py-2 text-sm"
                placeholder="Ejemplo: reposición de proveedor"
              />
            </div>

            {selectedProduct && (
              <p className="rounded-md bg-[#f5f0e6] px-3 py-2 text-sm">
                Stock actual: <strong>{selectedProduct.stockQuantity}</strong>
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedProductId || isAdjustingStock}
              className="inline-flex items-center gap-2 rounded-md bg-[#3f6b4c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2e4d36] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {movementType === "IN" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              {isAdjustingStock ? "Guardando..." : "Registrar movimiento"}
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Historial reciente</h2>

          {!selectedProductId ? (
            <p className="text-sm text-gray-500">
              Selecciona un producto para ver su historial.
            </p>
          ) : history?.items?.length ? (
            <div className="max-h-105 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3f6b4c]/15 text-left text-xs uppercase text-gray-500">
                    <th className="px-2 py-2">Fecha</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Cant.</th>
                    <th className="px-2 py-2">Antes</th>
                    <th className="px-2 py-2">Después</th>
                  </tr>
                </thead>
                <tbody>
                  {history.items.map((item) => (
                    <tr key={item._id} className="border-b border-[#3f6b4c]/10">
                      <td className="px-2 py-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-2 font-semibold">
                        {item.movementType}
                      </td>
                      <td className="px-2 py-2">{item.quantity}</td>
                      <td className="px-2 py-2">{item.beforeQuantity}</td>
                      <td className="px-2 py-2">{item.afterQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No hay movimientos registrados para este producto.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
