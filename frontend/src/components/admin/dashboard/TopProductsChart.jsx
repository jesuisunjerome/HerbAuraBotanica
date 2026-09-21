import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../lib/helper";

export default function TopProductsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        No hay datos de productos para este periodo.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            width={120}
            tickFormatter={(value) =>
              value.length > 20 ? `${value.substring(0, 20)}...` : value
            }
          />
          <Tooltip cursor={{ fill: "#f5f0e6", opacity: 0.4 }} content={<CustomTooltip />} />
          <Bar
            dataKey="quantity"
            fill="#f4c95d"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, quantity, revenue } = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-50">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {name}
        </p>
        <p className="text-[#3f6b4c] font-medium text-sm">
          Vendidos: {quantity} unidades
        </p>
        <p className="text-amber-600 font-medium text-sm -mt-2">
          Ingresos: {formatCurrency(revenue)}
        </p>
      </div>
    );
  }
  return null;
};