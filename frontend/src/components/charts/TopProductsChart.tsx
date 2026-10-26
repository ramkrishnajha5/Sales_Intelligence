import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TopEntityItem } from '../../types/analytics';

interface TopProductsChartProps {
  data: TopEntityItem[];
  metric?: 'profit' | 'sales';
  height?: number;
}

const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

const truncate = (str: string, maxLen: number = 22) =>
  str.length > maxLen ? `${str.substring(0, maxLen)}...` : str;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as TopEntityItem;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs max-w-xs">
        <div className="font-semibold text-slate-800 mb-1 leading-snug">{item.name}</div>
        {item.secondary && <div className="text-slate-500 text-[11px] mb-1">{item.secondary}</div>}
        <div className="text-emerald-600 font-medium">Profit: ${item.profit.toLocaleString()}</div>
        <div className="text-blue-600 font-medium">Sales: ${item.sales.toLocaleString()}</div>
        <div className="text-slate-500 mt-1">Orders: {item.orders}</div>
      </div>
    );
  }
  return null;
};

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data,
  metric = 'profit',
  height = 320,
}) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No items to display</div>;
  }

  const fill = metric === 'profit' ? '#10b981' : '#3b82f6';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickFormatter={val => truncate(val, 20)}
          tick={{ fontSize: 11, fill: '#334155' }}
          width={130}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={metric} fill={fill} radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
};
