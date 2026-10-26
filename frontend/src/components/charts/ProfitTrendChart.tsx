import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { MonthlyTrendItem } from '../../types/analytics';

interface ProfitTrendChartProps {
  data: MonthlyTrendItem[];
  height?: number;
}

const formatCurrency = (val: number) => `$${(val / 1000).toFixed(1)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonthlyTrendItem;
    const isLoss = data.profit < 0;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-800 mb-1">{label}</div>
        <div className={`font-semibold ${isLoss ? 'text-rose-600' : 'text-emerald-600'}`}>
          Net Profit: ${data.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-slate-500 mt-0.5">
          Margin: {data.profit_margin.toFixed(1)}%
        </div>
      </div>
    );
  }
  return null;
};

export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data, height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No profit data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
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
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#16a34a"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#16a34a' }}
          activeDot={{ r: 6, stroke: '#15803d', strokeWidth: 2, fill: '#ffffff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
