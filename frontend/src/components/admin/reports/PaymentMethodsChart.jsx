import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../../../lib/helper";

export default function PaymentMethodsChart({ data = [] }) {

    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                No hay datos en este periodo.
            </div>
        );
    }

    const COLORS = ["#3f6b4c", "#f4c95d", "#8c5a4d", "#d9a05b", "#5c7e68"];

    return (
        <div className="flex flex-col h-full">
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2 grow overflow-auto">
                {data.map((method, i) => (
                    <div key={method._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                            <span className="font-medium text-gray-700">{method._id}</span>
                        </div>
                        <span className="font-medium text-emerald-600">{formatCurrency(method.revenue)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}