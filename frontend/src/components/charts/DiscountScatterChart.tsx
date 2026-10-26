import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ScatterPoint {
  product_name: string;
  category: string;
  discount: number;
  profit: number;
  sales: number;
}

interface DiscountScatterChartProps {
  data: ScatterPoint[];
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const pt = payload[0].payload as ScatterPoint;
    const isLoss = pt.profit < 0;
    return (
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs max-w-xs">
        <div className="font-semibold text-slate-800 mb-1">{pt.product_name}</div>
        <div className="text-slate-500 mb-1">Category: {pt.category}</div>
        <div className="text-blue-600">Discount: {pt.discount}%</div>
        <div className={`font-semibold ${isLoss ? 'text-rose-600' : 'text-emerald-600'}`}>
          Profit: ${pt.profit.toFixed(2)}
        </div>
        <div className="text-slate-500">Sales: ${pt.sales.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

export const DiscountScatterChart: React.FC<DiscountScatterChartProps> = ({
  data,
  height = 280,
}) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No scatter data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
        <XAxis
          type="number"
          dataKey="discount"
          name="Discount"
          unit="%"
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          label={{ value: 'Discount Rate (%)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }}
        />
        <YAxis
          type="number"
          dataKey="profit"
          name="Profit"
          unit="$"
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
        />
        <ZAxis type="number" dataKey="sales" range={[40, 180]} />
        <Tooltip content={<CustomTooltip />} />
        <Scatter name="Transactions" data={data} fill="#3b82f6" fillOpacity={0.65} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
