import { AlertTriangleIcon, FileTextIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { usePendingOrdersCount } from "../../hooks/orders/queries";
import {
  useFilterDashboard,
  useLowStockProducts,
  useSalesReport,
} from "../../hooks/products/queries";
import { axiosInstance } from "../../lib/axios";
import { formatCurrency, formatShortDateToString } from "../../lib/helper";
import DailySalesChart from "../../components/admin/dashboard/DailySalesChart";
import TopProductsChart from "../../components/admin/dashboard/TopProductsChart";
import OrderStatusBadge from "../../components/admin/orders/OrderStatusBadge";

export default function DashboardPage() {
  const { from, to, minDate, maxDate, handleDateChange } = useFilterDashboard();
  const { salesReport } = useSalesReport({ from, to });
  const { lowStockProducts = [] } = useLowStockProducts();
  const { count: pendingOrders } = usePendingOrdersCount();
  const [_, setSearchParams] = useSearchParams();

  const handleDownloadReport = async () => {
    const response = await axiosInstance.get("/reports/sales/export.csv", {
      params: { from, to },
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `sales-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    setSearchParams({ from, to });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="space-y-6 pb-4">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-center gap-4 pb-3 pt-4 sticky top-15 z-10 bg-gray-50">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Aquí puedes ver un resumen de las ventas y productos de tu tienda.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex flex-1 gap-2">
            <input
              type="date"
              value={from}
              onChange={handleDateChange}
              name="from"
              max={maxDate ? maxDate.toISOString().split("T")[0] : ""}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white flex-1 cursor-pointer"
            />
            <input
              type="date"
              value={to}
              onChange={handleDateChange}
              name="to"
              min={minDate ? minDate.toISOString().split("T")[0] : ""}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white flex-1 cursor-pointer"
            />
          </div>
          <button
            title="Descargar Reporte"
            onClick={handleDownloadReport}
            className="bg-[#3f6b4c] text-white px-4 py-2 rounded-md hover:bg-[#2e4d36] focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] focus:ring-offset-2 transition"
          >
            <FileTextIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500 leading-tight">Ingresos Totales</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(salesReport?.summary?.totalRevenue || 0)}
            </p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Datos del rango seleccionado
            </p>
          </article>
          <article className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent">
            <p className="text-sm text-gray-500 leading-tight">Pedidos Pagados</p>
            <p className="mt-1 text-xl font-semibold">
              {salesReport?.summary?.totalOrders || 0}
            </p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Ventas confirmadas
            </p>
          </article>
          <article className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent">
            <p className="text-sm text-gray-500 leading-tight">
              Pedidos Pendientes
            </p>
            <p className="mt-1 text-xl font-semibold">{pendingOrders}</p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Requieren seguimiento
            </p>
          </article>
          <div className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent">
            <p className="text-sm text-gray-500 leading-tight">
              Productos Vendidos
            </p>
            <p className="mt-1 text-xl font-semibold">
              {salesReport?.summary?.totalItemsSold || 0}
            </p>
            <p className="mt-2 text-xs text-rose-600 font-semibold">
              Unidades del periodo
            </p>
          </div>
        </div>
        <article className="xl:w-1/3 rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent">
          <div className="mb-4">
            <p className="text-lg font-semibold">Alerta de Inventario</p>
            <p className="text-xs text-gray-500 leading-tight">Productos con bajo inventario urgente.</p>
          </div>
          {lowStockProducts.length > 0 &&
            <div className="h-50 rounded-xl p-3 overflow-auto">
              <ul className="space-y-2">
                {lowStockProducts.slice(0, 8).map((product) => (
                  <li
                    key={product._id}
                    className="flex items-center justify-between rounded-md bg-amber-50 border border-amber-200 px-2 py-2"
                  >
                    <span className="text-sm text-amber-900 font-medium">
                      {product.name}
                    </span>
                    <span className="text-xs text-amber-800">
                      {product.stockQuantity}/{product.lowStockThreshold}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          }
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
            <AlertTriangleIcon className="h-4 w-4" />
            {lowStockProducts.length} productos en bajo inventario
          </div>
        </article>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
          <div className="mb-4">
            <p className="text-lg font-semibold">Ventas Diarias</p>
            <p className="text-xs text-gray-500 leading-tight">Tendencia de ingresos y órdenes por día.</p>
          </div>
          <div className="h-80 rounded-xl flex items-center justify-center">
            <DailySalesChart data={salesReport?.dailySales || []} from={from} to={to} />
          </div>
        </div>
        <div className="lg:w-[45%] rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
          <div className="mb-4">
            <p className="text-lg font-semibold">Productos Más Vendidos</p>
            <p className="text-xs text-gray-500 leading-tight">Los artículos estrella que más dinero generan.</p>
          </div>
          <div className="h-80 rounded-xl flex items-center justify-center">
            <TopProductsChart data={salesReport?.topProducts || []} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
        <div className="flex justify-between items-start sm:items-center mb-3">
          <div>
            <p className="text-lg font-semibold">Pedidos Recientes</p>
            <p className="text-xs text-gray-500 leading-tight">Últimos pedidos registrados en el sistema.</p>
          </div>
          <Link to="/admin/orders" className="text-sm text-[#3f6b4c] font-semibold hover:underline">Ver todos</Link>
        </div>
        <div className="rounded-xl overflow-hidden text-gray-700">
          {salesReport?.orders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f5f0e6]/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ID Pedido</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesReport.orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 font-medium text-gray-900">{order.confirmationNumber || order._id.substring(0, 8)}</td>
                      <td className="px-4 py-3">{order.customer?.name || "N/A"}</td>
                      <td className="px-4 py-3">
                        {formatShortDateToString(new Date(order.createdAt))}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 font-medium">
              No hay pedidos recientes.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
