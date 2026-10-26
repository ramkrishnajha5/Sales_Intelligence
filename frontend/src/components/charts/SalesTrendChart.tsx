import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MonthlyTrendItem } from '../../types/analytics';

interface SalesTrendChartProps {
  data: MonthlyTrendItem[];
  height?: number;
}

const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonthlyTrendItem;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1">{label}</div>
        <div className="text-blue-600 font-medium">
          Sales: ${data.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-slate-500">
          Orders: {data.orders.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No trend data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="period"
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
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#2563eb"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#salesGrad)"
          activeDot={{ r: 5, stroke: '#1d4ed8', strokeWidth: 2, fill: '#ffffff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
