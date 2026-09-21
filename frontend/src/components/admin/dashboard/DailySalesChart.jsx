import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatShortDateToString } from "../../../lib/helper";

export default function DailySalesChart({ data = [], from, to }) {
  if (!from || !to) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        Cargando datos...
      </div>
    );
  }

  // Generar arreglo de fechas
  const startDate = new Date(`${from}T12:00:00`);
  const endDate = new Date(`${to}T12:00:00`);
  const diffDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
  const isShortRange = diffDays <= 7;

  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const isoString = currentDate.toISOString().split("T")[0];
    dateArray.push(isoString);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Mapear los datos de ventas por fecha para acceso rápido
  const salesMap = data.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  // Formatear datos para el gráfico
  const chartData = dateArray.map((dateStr) => {
    const dateObj = new Date(`${dateStr}T12:00:00`);
    const dayData = salesMap[dateStr];

    let dateLabel = formatShortDateToString(dateObj); // fallback
    if (isShortRange) {
      const weekday = new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(dateObj);
      dateLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace(".", "");
    } else {
      const formatted = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(dateObj);
      dateLabel = formatted.replace(".", "");
    }

    return {
      date: dateLabel,
      revenue: dayData ? dayData.revenue : 0,
      orders: dayData ? dayData.orders : 0,
      rawDate: dateStr,
    };
  });



  return (
    <div className="w-full h-full min-h-75">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3f6b4c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3f6b4c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
            minTickGap={20}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3f6b4c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, fill: "#f4c95d", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{label}</p>
        <p className="text-emerald-600 font-medium text-sm">
          Ingresos: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-gray-500 text-sm -mt-2">
          Pedidos: {payload[0].payload.orders}
        </p>
      </div>
    );
  }
  return null;
};