import { useMemo } from "react";
import { formatCurrency } from "../../../lib/helper";

export default function CardsKPI({ salesReport }) {
    const fulfillmentMetrics = useMemo(() => salesReport?.fulfillmentMetrics || { avgFulfillmentTime: 0 }, [salesReport]);
    const inventoryStats = useMemo(() => salesReport?.inventoryStats || { totalValue: 0, totalItems: 0 }, [salesReport]);
    const cancelledMetrics = useMemo(() => salesReport?.cancelledMetrics || { count: 0, totalLostRevenue: 0 }, [salesReport]);

    const averageOrderValue = salesReport?.summary?.totalOrders
        ? salesReport.summary.totalRevenue / salesReport.summary.totalOrders
        : 0;

    const avgFulfillmentHours = fulfillmentMetrics.avgFulfillmentTime
        ? (fulfillmentMetrics.avgFulfillmentTime / (1000 * 60 * 60)).toFixed(1)
        : 0;

    return (
        <>
            <Card
                title="Ingresos totales"
                value={formatCurrency(salesReport?.summary?.totalRevenue || 0)}
            />
            <Card
                title="Ordenes pagadas"
                value={salesReport?.summary?.totalOrders || 0}
            />
            <Card
                title="Ticket Promedio"
                value={formatCurrency(averageOrderValue)}
                variant="text-[#f4c95d]"
            />
            <Card
                title="Unidades vendidas"
                value={salesReport?.summary?.totalItemsSold || 0}
            />
            <Card
                title="Valor Inventario Actual"
                value={formatCurrency(inventoryStats.totalValue)}
            />
            <Card
                title="Unidades en Bodega"
                value={inventoryStats.totalItems}
            />
            <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
                <p className="text-sm text-gray-500 leading-tight">Tiempo Prom. Preparación</p>
                <p className="mt-1 text-xl font-semibold">
                    {avgFulfillmentHours} <span className="text-base font-medium text-gray-500">hrs</span>
                </p>
            </article>
            <Card
                title="Pérdida Cancelaciones"
                value={formatCurrency(cancelledMetrics.totalLostRevenue)}
                variant="text-red-600"
            />
        </>
    )
}

const Card = ({ title, value, variant }) => (
    <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
        <p className="text-sm text-gray-500 leading-tight">{title}</p>
        <p className={`mt-1 text-xl font-semibold ${variant}`}>{value}</p>
    </article>
)