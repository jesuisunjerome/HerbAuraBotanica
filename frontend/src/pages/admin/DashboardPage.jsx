import { FileTextIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useFilterDashboard } from "../../hooks/products/queries";

export default function DashboardPage() {
  const { from, to, minDate, maxDate, handleDateChange } = useFilterDashboard();
  const [_, setSearchParams] = useSearchParams();

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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          >
            <FileTextIcon className="w-5 h-5" />
            {/* Descargar Reporte */}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Ingresos Totales</p>
            <p className="mt-1 text-2xl font-medium">$145,500</p>
            <p className="mt-2 text-xs text-emerald-600">
              ↑ 12.25% desde la semana pasada
            </p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Pedido Promedio</p>
            <p className="mt-1 text-2xl font-medium">$1,250</p>
            <p className="mt-2 text-xs text-emerald-600">↑ 10%</p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Total de Clientes</p>
            <p className="mt-1 text-2xl font-medium">650</p>
            <p className="mt-2 text-xs text-emerald-600">↑ 8%</p>
          </div>
          <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Productos Vendidos</p>
            <p className="mt-1 text-2xl font-medium">450</p>
            <p className="mt-2 text-xs text-rose-600">↓ 2.5%</p>
          </div>
        </div>
        <div className="xl:w-1/3 rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
          <p className="mb-3 text-2xl font-medium">Información de Pedidos</p>
          <div className="h-50 bg-gray-50 rounded-xl">{/* Chart circle */}</div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="flex items-center justify-center gap-1">
              <span className="inline-block h-3 w-3 bg-yellow-400 rounded-sm"></span>
              <p className="text-xs leading-tight text-gray-500">Enviados</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="inline-block h-3 w-3 bg-blue-500 rounded-sm"></span>
              <p className="text-xs leading-tight text-gray-500">Entregados</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="inline-block h-3 w-3 bg-rose-500 rounded-sm"></span>
              <p className="text-xs leading-tight text-gray-500">Devueltos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
        <p className="mb-3 text-2xl font-medium">Pedidos Pendientes</p>
        <div className="h-50 bg-gray-50 rounded-xl overflow-auto">
          {/* Table recent orders */}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
          <p className="mb-3 text-2xl font-medium">Mejores Ventas</p>
          <div className="h-50 bg-gray-50 rounded-xl">
            {/* Chart sales daily */}
          </div>
        </div>
        <div className="lg:w-[45%] rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
          <p className="mb-3 text-2xl font-medium">Productos Más Vendidos</p>
          <div className="h-50 bg-gray-50 rounded-xl"></div>
        </div>
      </div>
    </section>
  );
}
