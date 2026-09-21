import { useMemo } from "react";
import {
  useFilterDashboard,
  useSalesReport,
  useInventoryMovementsReport,
} from "../../hooks/products/queries";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router";
import { FileDownIcon } from "lucide-react";
import { useDashboardTable } from "../../hooks/reports/useDashboardTable";
import ReportTableCard from "../../components/admin/reports/ReportTableCard";
import { useReportColumns } from "../../components/admin/reports/useReportColumns";
import CardsKPI from "../../components/admin/reports/CardsKPI";
import CardsChart from "../../components/admin/reports/CardsChart";

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
  const { from, to, handleDateChange } = useFilterDashboard();
  const { salesReport, isLoadingSalesReport } = useSalesReport({ from, to });
  const { inventoryMovements, isLoadingInventoryMovements } = useInventoryMovementsReport({ from, to, limit: 100 });

  const topCustomers = useMemo(() => salesReport?.topCustomers || [], [salesReport]);
  const topProducts = useMemo(() => salesReport?.topProducts || [], [salesReport]);
  const bottomProducts = useMemo(() => salesReport?.bottomProducts || [], [salesReport]);
  const topCities = useMemo(() => salesReport?.topCities || [], [salesReport]);
  const lowStockProducts = useMemo(() => salesReport?.lowStockProducts || [], [salesReport]);
  const adjustments = useMemo(() => salesReport?.adjustments || [], [salesReport]);
  const orders = useMemo(() => salesReport?.orders || [], [salesReport]);

  const {
    customerColumns,
    productColumns,
    inventoryColumns,
    adjustmentColumns,
    orderColumns,
    cityColumns,
    inventoryMovementColumns,
  } = useReportColumns();

  const tableCustomers = useDashboardTable(topCustomers, customerColumns);
  const tableProducts = useDashboardTable(topProducts, productColumns);
  const tableBottomProducts = useDashboardTable(bottomProducts, productColumns);
  const tableCities = useDashboardTable(topCities, cityColumns);
  const tableLowStock = useDashboardTable(lowStockProducts, inventoryColumns);
  const tableAdjustments = useDashboardTable(adjustments, adjustmentColumns);
  const tableOrders = useDashboardTable(orders, orderColumns);

  const movementsList = useMemo(() => inventoryMovements?.movements || [], [inventoryMovements]);
  const tableInventoryMovements = useDashboardTable(movementsList, inventoryMovementColumns);

  return (
    <section className="space-y-6 pb-4">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-end gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-sm text-gray-600">
            Consulta ventas y movimientos de inventario por rango de fechas.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="date"
            name="from"
            value={from}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] text-sm"
          />
          <span className="self-center">a</span>
          <input
            type="date"
            name="to"
            value={to}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => downloadCsv("/reports/sales/export.csv", { from, to })}
            className="flex items-center gap-2 bg-[#3f6b4c] text-white px-4 py-2 rounded-md hover:bg-[#2e4d36] transition-colors w-full md:w-auto justify-center"
          >
            <FileDownIcon size={18} />
            Ventas (CSV)
          </button>
          <button
            onClick={() => downloadCsv("/reports/movements/export.csv", { from, to })}
            className="flex items-center gap-2 border border-[#3f6b4c] text-[#3f6b4c] bg-white px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full md:w-auto justify-center"
          >
            <FileDownIcon size={18} />
            Movimientos (CSV)
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-8">
        <CardsKPI salesReport={salesReport} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <CardsChart isPending={isLoadingSalesReport} salesReport={salesReport} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ReportTableCard
          className="xl:col-span-2"
          title="Top Clientes VIP"
          subtitle="Clientes con el mayor volumen de compra en este periodo."
          table={tableCustomers}
          columnsLength={customerColumns.length}
          emptyMessage="Sin datos de clientes en este rango."
          searchPlaceholder="Buscar cliente..."
          isPending={isLoadingSalesReport}
        />

        <ReportTableCard
          title="Top Ciudades"
          subtitle="Zonas geográficas de donde provienen tus mayores ingresos."
          table={tableCities}
          columnsLength={cityColumns.length}
          emptyMessage="Sin datos."
          searchPlaceholder="Buscar ciudad..."
          isPending={isLoadingSalesReport}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportTableCard
          title="Productos Más Vendidos"
          subtitle="Los artículos estrella que más dinero generan y más rotan."
          table={tableProducts}
          columnsLength={productColumns.length}
          emptyMessage="Sin datos de productos en este rango."
          searchPlaceholder="Buscar producto..."
          isPending={isLoadingSalesReport}
        />

        <ReportTableCard
          title="Productos Estancados (Slow Movers)"
          subtitle="Artículos con menor venta. Considera promocionarlos."
          table={tableBottomProducts}
          columnsLength={productColumns.length}
          emptyMessage="Sin datos de productos en este rango."
          searchPlaceholder="Buscar producto..."
          isPending={isLoadingSalesReport}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ReportTableCard
          className="xl:col-span-1"
          headerClassName="text-red-600"
          icon={<span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
          title="Alertas de Inventario"
          subtitle="Productos con 10 o menos unidades en stock para reabastecimiento."
          table={tableLowStock}
          columnsLength={inventoryColumns.length}
          emptyMessage="Todo el inventario está sano."
          searchPlaceholder="Buscar producto..."
          isPending={isLoadingSalesReport}
        />

        <ReportTableCard
          className="xl:col-span-2"
          title="Registro de Mermas y Ajustes Manuales"
          subtitle="Historial operativo de pérdidas o entradas de inventario no ligadas a una venta."
          table={tableAdjustments}
          columnsLength={adjustmentColumns.length}
          emptyMessage="No hubo mermas ni ajustes en este periodo."
          searchPlaceholder="Buscar producto..."
          isPending={isLoadingSalesReport}
        />
      </div>

      <ReportTableCard
        title="Órdenes Recientes"
        subtitle="Historial detallado de todas las transacciones realizadas en el periodo."
        table={tableOrders}
        columnsLength={orderColumns.length}
        emptyMessage="No se encontraron órdenes en este periodo."
        searchPlaceholder="Buscar orden..."
        isPending={isLoadingSalesReport}
        actionElement={
          <Link to="/admin/orders" className="text-[#3f6b4c] text-sm font-semibold hover:underline text-nowrap">
            Ver todas las órdenes &rarr;
          </Link>
        }
      />

      <ReportTableCard
        title="Movimientos Generales de Inventario"
        subtitle="Historial detallado de todas las entradas y salidas de inventario (incluyendo ventas y mermas)."
        table={tableInventoryMovements}
        columnsLength={inventoryMovementColumns.length}
        emptyMessage="No se encontraron movimientos de inventario en este periodo."
        searchPlaceholder="Buscar movimiento..."
        isPending={isLoadingInventoryMovements}
      />

    </section>
  );
}
