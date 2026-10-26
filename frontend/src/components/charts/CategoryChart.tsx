import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CategoryBreakdownItem } from '../../types/analytics';

interface CategoryChartProps {
  data: CategoryBreakdownItem[];
  height?: number;
}

const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as CategoryBreakdownItem;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1.5">{label}</div>
        <div className="text-blue-600 font-medium">Sales: ${item.sales.toLocaleString()}</div>
        <div className="text-emerald-600 font-medium">Profit: ${item.profit.toLocaleString()}</div>
        <div className="text-slate-500 mt-1">Margin: {item.profit_margin.toFixed(1)}%</div>
      </div>
    );
  }
  return null;
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No category data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
        />
        <Bar dataKey="sales" name="Sales ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="profit" name="Net Profit ($)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};
