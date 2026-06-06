import { FileDownIcon } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  useFetchProducts,
  useFilterDashboard,
  useInventoryMovementsReport,
  useSalesReport,
} from "../../hooks/products/queries";
import { axiosInstance } from "../../lib/axios";
import { formatCurrency } from "../../lib/helper";

const downloadCsv = async (endpoint, params) => {
  const response = await axiosInstance.get(endpoint, {
    params,
    responseType: "blob",
  });

  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = endpoint.includes("sales")
    ? `sales-report-${Date.now()}.csv`
    : `inventory-movements-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { from, to, minDate, maxDate, handleDateChange } = useFilterDashboard();

  const salesPage = Number(searchParams.get("salesPage") || 1);
  const salesLimit = Number(searchParams.get("salesLimit") || 10);
  const salesSearch = searchParams.get("salesSearch") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const salesSortBy = searchParams.get("salesSortBy") || "paidAt";
  const salesSortOrder = searchParams.get("salesSortOrder") || "desc";

  const movementsPage = Number(searchParams.get("movementsPage") || 1);
  const movementsLimit = Number(searchParams.get("movementsLimit") || 20);
  const movementType = searchParams.get("movementType") || "";
  const movementCategory = searchParams.get("movementCategory") || "";
  const movementProductId = searchParams.get("movementProductId") || "";
  const movementSearch = searchParams.get("movementSearch") || "";
  const movementSortBy = searchParams.get("movementSortBy") || "createdAt";
  const movementSortOrder = searchParams.get("movementSortOrder") || "desc";

  const updateParams = (updates) => {
    setSearchParams((currentParams) => {
      const next = new URLSearchParams(currentParams);

      Object.entries(updates).forEach(([name, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(name);
        } else {
          next.set(name, String(value));
        }
      });

      return next;
    });
  };

  const updateParam = (name, value) => {
    updateParams({ [name]: value });
  };

  const handleReportDateChange = (event) => {
    handleDateChange(event);
    updateParams({ salesPage: 1, movementsPage: 1 });
  };

  const clearReportFilters = () => {
    updateParams({
      salesPage: 1,
      salesLimit: "",
      salesSearch: "",
      paymentMethod: "",
      salesSortBy: "",
      salesSortOrder: "",
      movementsPage: 1,
      movementsLimit: "",
      movementType: "",
      movementCategory: "",
      movementProductId: "",
      movementSearch: "",
      movementSortBy: "",
      movementSortOrder: "",
    });
  };

  const { products = [] } = useFetchProducts();
  const { salesReport, isLoadingSalesReport } = useSalesReport({
    from,
    to,
    page: salesPage,
    limit: salesLimit,
    search: salesSearch,
    paymentMethod,
    sortBy: salesSortBy,
    sortOrder: salesSortOrder,
  });
  const { inventoryMovements, isLoadingInventoryMovements } =
    useInventoryMovementsReport({
      from,
      to,
      page: movementsPage,
      limit: movementsLimit,
      movementType,
      category: movementCategory,
      productId: movementProductId,
      search: movementSearch,
      sortBy: movementSortBy,
      sortOrder: movementSortOrder,
    });

  const movementRows = useMemo(
    () => inventoryMovements?.movements || [],
    [inventoryMovements],
  );
  const salesRows = useMemo(() => salesReport?.orders || [], [salesReport]);

  return (
    <section className="space-y-6 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-sm text-gray-600">
            Consulta ventas y movimientos de inventario por rango de fechas.
          </p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 md:w-auto md:grid-cols-5">
          <input
            type="date"
            value={from}
            onChange={handleReportDateChange}
            name="from"
            max={maxDate ? maxDate.toISOString().split("T")[0] : ""}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={handleReportDateChange}
            name="to"
            min={minDate ? minDate.toISOString().split("T")[0] : ""}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              downloadCsv("/reports/sales/export.csv", {
                from,
                to,
                search: salesSearch,
                paymentMethod,
                sortBy: salesSortBy,
                sortOrder: salesSortOrder,
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3f6b4c]/30 bg-white px-3 py-2 text-sm font-medium hover:bg-[#f5f0e6]"
          >
            <FileDownIcon className="h-4 w-4" />
            Ventas CSV
          </button>
          <button
            type="button"
            onClick={() =>
              downloadCsv("/reports/movements/export.csv", {
                from,
                to,
                movementType,
                category: movementCategory,
                productId: movementProductId,
                search: movementSearch,
                sortBy: movementSortBy,
                sortOrder: movementSortOrder,
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#3f6b4c] px-3 py-2 text-sm font-semibold text-white hover:bg-[#2e4d36]"
          >
            <FileDownIcon className="h-4 w-4" />
            Movimientos CSV
          </button>
          <button
            type="button"
            onClick={clearReportFilters}
            className="inline-flex items-center justify-center rounded-md border border-[#3f6b4c]/30 bg-white px-3 py-2 text-sm font-medium hover:bg-[#f5f0e6]"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Ingresos totales</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(salesReport?.summary?.totalRevenue || 0)}
          </p>
        </article>
        <article className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Ordenes pagadas</p>
          <p className="mt-2 text-2xl font-bold">
            {salesReport?.summary?.totalOrders || 0}
          </p>
        </article>
        <article className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Unidades vendidas</p>
          <p className="mt-2 text-2xl font-bold">
            {salesReport?.summary?.totalItemsSold || 0}
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Ordenes pagadas</h2>
        <div className="mb-3 grid gap-2 md:grid-cols-6">
          <input
            value={salesSearch}
            onChange={(e) => {
              updateParams({ salesSearch: e.target.value, salesPage: 1 });
            }}
            placeholder="Buscar orden/cliente"
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm md:col-span-2"
          />
          <select
            value={paymentMethod}
            onChange={(e) => {
              updateParams({ paymentMethod: e.target.value, salesPage: 1 });
            }}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los pagos</option>
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
            <option value="Mercado Pago">Mercado Pago</option>
            <option value="Apple Pay">Apple Pay</option>
          </select>
          <select
            value={salesSortBy}
            onChange={(e) =>
              updateParams({ salesSortBy: e.target.value, salesPage: 1 })
            }
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="paidAt">Ordenar por fecha de pago</option>
            <option value="totalPrice">Ordenar por total</option>
            <option value="createdAt">Ordenar por creacion</option>
          </select>
          <select
            value={salesSortOrder}
            onChange={(e) =>
              updateParams({ salesSortOrder: e.target.value, salesPage: 1 })
            }
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
          <select
            value={salesLimit}
            onChange={(e) => {
              updateParams({ salesLimit: e.target.value, salesPage: 1 });
            }}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} por pagina
              </option>
            ))}
          </select>
        </div>

        {isLoadingSalesReport ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : salesRows.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay ordenes para este filtro.
          </p>
        ) : (
          <>
            <div className="max-h-100 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3f6b4c]/15 text-left text-xs uppercase text-gray-500">
                    <th className="px-2 py-2">Orden</th>
                    <th className="px-2 py-2">Cliente</th>
                    <th className="px-2 py-2">Metodo</th>
                    <th className="px-2 py-2">Fecha pago</th>
                    <th className="px-2 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRows.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[#3f6b4c]/10"
                    >
                      <td className="px-2 py-2 font-semibold">
                        {order.confirmationNumber}
                      </td>
                      <td className="px-2 py-2">
                        <p>{order.customer?.name}</p>
                        <p className="text-xs text-gray-500">
                          {order.customer?.email}
                        </p>
                      </td>
                      <td className="px-2 py-2">{order.paymentMethod}</td>
                      <td className="px-2 py-2">
                        {order.paidAt
                          ? new Date(order.paidAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-2 py-2 font-semibold text-[#3f6b4c]">
                        {formatCurrency(order.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Pagina {salesReport?.pagination?.page || 1} de{" "}
                {salesReport?.pagination?.totalPages || 1} (
                {salesReport?.pagination?.total || 0} resultados)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={(salesReport?.pagination?.page || 1) <= 1}
                  onClick={() =>
                    updateParam("salesPage", Math.max(1, salesPage - 1))
                  }
                  className="rounded-md border border-[#3f6b4c]/25 px-3 py-1 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={
                    (salesReport?.pagination?.page || 1) >=
                    (salesReport?.pagination?.totalPages || 1)
                  }
                  onClick={() => updateParam("salesPage", salesPage + 1)}
                  className="rounded-md border border-[#3f6b4c]/25 px-3 py-1 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl border border-[#3f6b4c]/15 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">
          Movimientos recientes de inventario
        </h2>

        <div className="mb-3 grid gap-2 md:grid-cols-7">
          <input
            value={movementSearch}
            onChange={(e) => {
              updateParams({
                movementSearch: e.target.value,
                movementsPage: 1,
              });
            }}
            placeholder="Buscar producto/categoria"
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm md:col-span-2"
          />
          <select
            value={movementType}
            onChange={(e) => {
              updateParams({ movementType: e.target.value, movementsPage: 1 });
            }}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
          <input
            value={movementCategory}
            onChange={(e) => {
              updateParams({
                movementCategory: e.target.value,
                movementsPage: 1,
              });
            }}
            placeholder="Categoria"
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          />
          <select
            value={movementProductId}
            onChange={(e) => {
              updateParams({
                movementProductId: e.target.value,
                movementsPage: 1,
              });
            }}
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los productos</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <select
            value={movementSortBy}
            onChange={(e) =>
              updateParams({ movementSortBy: e.target.value, movementsPage: 1 })
            }
            className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
          >
            <option value="createdAt">Ordenar por fecha</option>
            <option value="quantity">Ordenar por cantidad</option>
            <option value="beforeQuantity">Ordenar por stock antes</option>
            <option value="afterQuantity">Ordenar por stock despues</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={movementSortOrder}
              onChange={(e) =>
                updateParams({
                  movementSortOrder: e.target.value,
                  movementsPage: 1,
                })
              }
              className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select
              value={movementsLimit}
              onChange={(e) => {
                updateParams({
                  movementsLimit: e.target.value,
                  movementsPage: 1,
                });
              }}
              className="rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoadingInventoryMovements ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : movementRows.length === 0 ? (
          <p className="text-sm text-gray-500">
            Sin movimientos para el rango seleccionado.
          </p>
        ) : (
          <>
            <div className="max-h-100 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3f6b4c]/15 text-left text-xs uppercase text-gray-500">
                    <th className="px-2 py-2">Fecha</th>
                    <th className="px-2 py-2">Producto</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Cantidad</th>
                    <th className="px-2 py-2">Antes</th>
                    <th className="px-2 py-2">Despues</th>
                  </tr>
                </thead>
                <tbody>
                  {movementRows.map((movement) => (
                    <tr
                      key={movement._id}
                      className="border-b border-[#3f6b4c]/10"
                    >
                      <td className="px-2 py-2">
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-2">
                        {movement.product?.name || "-"}
                      </td>
                      <td className="px-2 py-2 font-semibold">
                        {movement.movementType}
                      </td>
                      <td className="px-2 py-2">{movement.quantity}</td>
                      <td className="px-2 py-2">{movement.beforeQuantity}</td>
                      <td className="px-2 py-2">{movement.afterQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Pagina {inventoryMovements?.pagination?.page || 1} de{" "}
                {inventoryMovements?.pagination?.totalPages || 1} (
                {inventoryMovements?.pagination?.total || 0} resultados)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={(inventoryMovements?.pagination?.page || 1) <= 1}
                  onClick={() =>
                    updateParam("movementsPage", Math.max(1, movementsPage - 1))
                  }
                  className="rounded-md border border-[#3f6b4c]/25 px-3 py-1 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={
                    (inventoryMovements?.pagination?.page || 1) >=
                    (inventoryMovements?.pagination?.totalPages || 1)
                  }
                  onClick={() =>
                    updateParam("movementsPage", movementsPage + 1)
                  }
                  className="rounded-md border border-[#3f6b4c]/25 px-3 py-1 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
