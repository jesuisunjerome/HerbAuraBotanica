import { Bar, BarChart, CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../../lib/helper";

export default function TopCategoriesChart({ data = [] }) {

    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                No hay datos de productos para este periodo.
            </div>
        );
    }

    return (
        <div className="w-full h-85">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: "#f5f0e6", opacity: 0.4 }} content={<CustomTooltip />} />

                    <Legend iconType="circle" />
                    <Bar yAxisId="left" dataKey="quantity" name="Unidades" fill="#f4c95d" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar yAxisId="right" dataKey="revenue" name="Ingresos" fill="#3f6b4c" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        const { _id, revenue, quantity } = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-50">
                <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                    {_id}
                </p>
                <p className="text-amber-600 font-medium text-sm">
                    Ingresos: {formatCurrency(revenue)}
                </p>
                <p className="text-emerald-600 font-medium text-sm -mt-2">
                    Unidades: {quantity}
                </p>
            </div>
        );
    }
    return null;
}