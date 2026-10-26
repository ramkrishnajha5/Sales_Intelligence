import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface ShippingChartProps {
  data: Array<{
    ship_mode: string;
    orders: number;
    sales: number;
    profit: number;
    avg_days: number;
  }>;
  height?: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1">{item.ship_mode}</div>
        <div className="text-blue-600 font-medium">Orders: {item.orders.toLocaleString()}</div>
        <div className="text-slate-600">Sales: ${item.sales.toLocaleString()}</div>
        <div className="text-slate-500 mt-1">Avg Transit: {item.avg_days} days</div>
      </div>
    );
  }
  return null;
};

export const ShippingChart: React.FC<ShippingChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No shipping data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="orders"
          nameKey="ship_mode"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
