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
import { RegionalBreakdownItem } from '../../types/analytics';

interface RegionalChartProps {
  data: RegionalBreakdownItem[];
  height?: number;
}

const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as RegionalBreakdownItem;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1.5">{label} Region</div>
        <div className="text-blue-600 font-medium">Sales: ${item.sales.toLocaleString()}</div>
        <div className="text-emerald-600 font-medium">Profit: ${item.profit.toLocaleString()}</div>
        <div className="text-slate-500 mt-1">Margin: {item.profit_margin.toFixed(1)}% | Orders: {item.orders}</div>
      </div>
    );
  }
  return null;
};

export const RegionalChart: React.FC<RegionalChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No regional data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          type="category"
          dataKey="region"
          tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
        />
        <Bar dataKey="sales" name="Sales ($)" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={20} />
        <Bar dataKey="profit" name="Profit ($)" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};
