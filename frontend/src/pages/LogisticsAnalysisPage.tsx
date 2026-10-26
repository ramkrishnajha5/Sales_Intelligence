import React from 'react';
import { LogisticsAnalysisResponse } from '../types/analytics';
import { ChartCard } from '../components/dashboard/ChartCard';
import { ShippingChart } from '../components/charts/ShippingChart';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Truck, Clock, Percent, Table2, Info } from 'lucide-react';

interface LogisticsAnalysisPageProps {
  data: LogisticsAnalysisResponse | null;
  onResetFilters: () => void;
}

export const LogisticsAnalysisPage: React.FC<LogisticsAnalysisPageProps> = ({
  data,
  onResetFilters,
}) => {
  if (!data || data.ship_mode_breakdown.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const {
    ship_mode_breakdown,
    avg_shipping_days,
    discount_distribution,
    correlation_matrix,
    numerical_stats,
    insights,
  } = data;

  const corrKeys = Object.keys(correlation_matrix);

  const getCorrColor = (val: number) => {
    if (val === 1) return 'bg-slate-100 text-slate-800 font-bold';
    if (val > 0.4) return 'bg-blue-100 text-blue-900 font-semibold';
    if (val > 0) return 'bg-blue-50 text-blue-800';
    if (val < -0.2) return 'bg-rose-100 text-rose-900 font-semibold';
    if (val < 0) return 'bg-rose-50 text-rose-800';
    return 'bg-white text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Logistics Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Shipping Latency</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{avg_shipping_days} Days</div>
          <div className="text-xs text-slate-400 mt-1">Mean duration between Order Date and Ship Date</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Primary Shipping Mode</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {ship_mode_breakdown[0]?.ship_mode || 'Standard Class'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Accounts for {ship_mode_breakdown[0]?.orders.toLocaleString()} orders
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Discount / Profit Correlation</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">
            {correlation_matrix['Discount']?.['Profit'] !== undefined ? correlation_matrix['Discount']['Profit'] : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Negative Pearson correlation indicates margin drop</div>
        </div>
      </div>

      {/* Shipping Breakdown and Discount Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Orders by Shipping Mode"
          subtitle="Proportion of orders fulfilled across standard, second, first class and same day"
        >
          <ShippingChart data={ship_mode_breakdown} height={280} />
        </ChartCard>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Discount Bracket Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">
              Order volume, sales revenue, and net profit grouped by promotional discount tier
            </p>
            <div className="space-y-2.5">
              {discount_distribution.map(d => (
                <div key={d.bracket} className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{d.bracket}</span>
                    <span className="text-slate-400 ml-2">({d.orders} orders)</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-600">${d.sales.toLocaleString()}</span>
                    <span className={`font-semibold ${d.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${d.profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Correlation Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Numerical Feature Correlation Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Pearson correlation coefficients between core dataset continuous variables
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Association does not equal causation</span>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-3 text-left font-semibold text-slate-600 bg-slate-50">Feature</th>
                {corrKeys.map(k => (
                  <th key={k} className="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corrKeys.map(rowKey => (
                <tr key={rowKey} className="border-b border-slate-100">
                  <td className="py-2.5 px-3 text-left font-semibold text-slate-700 bg-slate-50/50">{rowKey}</td>
                  {corrKeys.map(colKey => {
                    const val = correlation_matrix[rowKey]?.[colKey] ?? 0;
                    return (
                      <td key={colKey} className={`py-2 px-3 border border-slate-100 ${getCorrColor(val)}`}>
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <Table2 className="w-4 h-4 text-blue-600" />
          Summary Descriptive Statistics (Parametric & Non-Parametric)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Comprehensive five-number summary and standard deviation metrics for numeric attributes
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Variable</th>
                <th className="py-2.5 px-3 text-right">Count</th>
                <th className="py-2.5 px-3 text-right">Mean</th>
                <th className="py-2.5 px-3 text-right">Std Dev</th>
                <th className="py-2.5 px-3 text-right">Min</th>
                <th className="py-2.5 px-3 text-right">25% (Q1)</th>
                <th className="py-2.5 px-3 text-right">Median</th>
                <th className="py-2.5 px-3 text-right">75% (Q3)</th>
                <th className="py-2.5 px-3 text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(numerical_stats).map(([k, stats]) => (
                <tr key={k} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{k}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.count.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.mean.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.std.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.min.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.q25.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.median.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.q75.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{stats.max.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
