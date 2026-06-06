import { AlertTriangleIcon, FileTextIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useGetAllOrders } from "../../hooks/orders/queries";
import {
  useFilterDashboard,
  useLowStockProducts,
  useSalesReport,
} from "../../hooks/products/queries";
import { axiosInstance } from "../../lib/axios";
import { formatCurrency } from "../../lib/helper";

export default function DashboardPage() {
  const { from, to, minDate, maxDate, handleDateChange } = useFilterDashboard();
  const { salesReport } = useSalesReport({ from, to });
  const { lowStockProducts = [] } = useLowStockProducts();
  const { orders = [] } = useGetAllOrders();
  const [_, setSearchParams] = useSearchParams();

  const pendingOrders = orders.filter((order) => !order.isPaid).length;

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
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-center gap-4 pb-3 pt-4 sticky top-15 z-10 bg-gray-50">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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
          <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Ingresos Totales</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(salesReport?.summary?.totalRevenue || 0)}
            </p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Datos del rango seleccionado
            </p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 font-medium">Pedidos Pagados</p>
            <p className="mt-1 text-2xl font-bold">
              {salesReport?.summary?.totalOrders || 0}
            </p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Ventas confirmadas
            </p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 font-medium">
              Pedidos Pendientes
            </p>
            <p className="mt-1 text-2xl font-bold">{pendingOrders}</p>
            <p className="mt-2 text-xs text-[#3f6b4c] font-semibold">
              Requieren seguimiento
            </p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-500 font-medium">
              Productos Vendidos
            </p>
            <p className="mt-1 text-2xl font-bold">
              {salesReport?.summary?.totalItemsSold || 0}
            </p>
            <p className="mt-2 text-xs text-rose-600 font-semibold">
              Unidades del periodo
            </p>
          </div>
        </div>
        <div className="xl:w-1/3 rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 border-t-4 border-transparent hover:shadow-xl transition-all duration-300">
          <p className="mb-3 text-xl font-bold">Alerta de Inventario</p>
          <div className="h-50 bg-[#f5f0e6]/30 rounded-xl p-3 overflow-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 font-medium text-sm">
                No hay alertas activas.
              </p>
            ) : (
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
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
            <AlertTriangleIcon className="h-4 w-4" />
            {lowStockProducts.length} productos en bajo inventario
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 hover:shadow-xl transition-all duration-300">
        <p className="mb-3 text-xl font-bold">Pedidos Pendientes</p>
        <div className="h-50 bg-[#f5f0e6]/20 rounded-xl overflow-auto flex items-center justify-center text-gray-400 font-medium">
          {/* Table recent orders */}
          Cargando pedidos recientes...
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 hover:shadow-xl transition-all duration-300">
          <p className="mb-3 text-xl font-bold">Mejores Ventas</p>
          <div className="h-50 bg-[#f5f0e6]/20 rounded-xl flex items-center justify-center text-gray-400 font-medium">
            {/* Chart sales daily */}
            Gráfico de Ventas Diarias
          </div>
        </div>
        <div className="lg:w-[45%] rounded-2xl shadow-lg shadow-[#4b2e2e]/5 bg-white px-5 py-4 hover:shadow-xl transition-all duration-300">
          <p className="mb-3 text-xl font-bold">Productos Más Vendidos</p>
          <div className="h-50 bg-[#f5f0e6]/20 rounded-xl flex items-center justify-center text-gray-400 font-medium">
            Gráfico de Más Vendidos
          </div>
        </div>
      </div>
    </section>
  );
}
