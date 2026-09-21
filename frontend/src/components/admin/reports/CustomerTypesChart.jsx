import { Legend, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../../../lib/helper";

export default function CustomerTypesChart({ data = [] }) {

    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                No hay datos en este periodo.
            </div>
        );
    }

    const CUSTOMER_TYPE_COLORS = ["#d9a05b", "#3f6b4c"];

    return (
        <div className="w-full h-75">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="_id"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CUSTOMER_TYPE_COLORS[index % CUSTOMER_TYPE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend position="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}