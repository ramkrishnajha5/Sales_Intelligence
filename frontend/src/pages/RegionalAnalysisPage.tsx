import React from 'react';
import { RegionalAnalysisResponse, StateBreakdownItem } from '../types/analytics';
import { ChartCard } from '../components/dashboard/ChartCard';
import { RegionalChart } from '../components/charts/RegionalChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { DataTable, Column } from '../components/tables/DataTable';
import { EmptyState } from '../components/dashboard/EmptyState';
import { MapPin, Globe, TrendingUp, AlertTriangle } from 'lucide-react';

interface RegionalAnalysisPageProps {
  data: RegionalAnalysisResponse | null;
  onResetFilters: () => void;
}

export const RegionalAnalysisPage: React.FC<RegionalAnalysisPageProps> = ({
  data,
  onResetFilters,
}) => {
  if (!data || data.state_table.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const {
    regional_breakdown,
    top_states_sales,
    top_states_profit,
    least_profitable_states,
    category_by_region,
    state_table,
  } = data;

  const stateColumns: Column<StateBreakdownItem>[] = [
    { key: 'state', header: 'State', sortable: true },
    { key: 'region', header: 'Region', sortable: true },
    {
      key: 'sales',
      header: 'Sales ($)',
      sortable: true,
      align: 'right',
      render: r => `$${r.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'profit',
      header: 'Profit ($)',
      sortable: true,
      align: 'right',
      render: r => (
        <span className={r.profit >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
          ${r.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'profit_margin',
      header: 'Profit Margin',
      sortable: true,
      align: 'right',
      render: r => `${r.profit_margin.toFixed(1)}%`,
    },
    {
      key: 'orders',
      header: 'Total Orders',
      sortable: true,
      align: 'right',
      render: r => r.orders.toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Regional Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regional_breakdown.map(reg => (
          <div key={reg.region} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                {reg.region} Region
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {reg.profit_margin.toFixed(1)}% margin
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">${reg.sales.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Profit: ${reg.profit.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex justify-between">
              <span>{reg.orders.toLocaleString()} orders</span>
              <span>{reg.customers.toLocaleString()} clients</span>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Chart & Top States by Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Regional Contribution Breakdown"
          subtitle="Horizontal comparison of sales and net profit per region"
        >
          <RegionalChart data={regional_breakdown} height={280} />
        </ChartCard>

        <ChartCard
          title="Top 10 Most Profitable States"
          subtitle="States delivering the highest net earnings"
          badge="High Margin"
        >
          <TopProductsChart
            data={top_states_profit.map(s => ({
              name: s.state,
              sales: s.sales,
              profit: s.profit,
              orders: s.orders,
              secondary: s.region,
            }))}
            metric="profit"
            height={280}
          />
        </ChartCard>
      </div>

      {/* Top States by Sales vs Least Profitable States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 States by Sales Volume"
          subtitle="States generating the largest aggregate sales revenue"
        >
          <TopProductsChart
            data={top_states_sales.map(s => ({
              name: s.state,
              sales: s.sales,
              profit: s.profit,
              orders: s.orders,
              secondary: s.region,
            }))}
            metric="sales"
            height={280}
          />
        </ChartCard>

        <ChartCard
          title="10 Least Profitable States (Deficit States)"
          subtitle="States exhibiting negative cumulative profits (losses)"
          badge="Deficit Watch"
        >
          <TopProductsChart
            data={least_profitable_states.map(s => ({
              name: s.state,
              sales: s.sales,
              profit: s.profit,
              orders: s.orders,
              secondary: s.region,
            }))}
            metric="profit"
            height={280}
          />
        </ChartCard>
      </div>

      {/* Full State Ledger Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            State-by-State Operational Performance Table
          </h3>
          <span className="text-xs text-slate-500">{state_table.length} states reporting</span>
        </div>
        <DataTable columns={stateColumns} data={state_table} pageSize={10} />
      </div>
    </div>
  );
};
