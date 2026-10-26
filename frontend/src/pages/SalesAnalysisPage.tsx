import React from 'react';
import { SalesAnalysisResponse, MonthlyTrendItem } from '../types/analytics';
import { ChartCard } from '../components/dashboard/ChartCard';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { RegionalChart } from '../components/charts/RegionalChart';
import { DataTable, Column } from '../components/tables/DataTable';
import { EmptyState } from '../components/dashboard/EmptyState';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

interface SalesAnalysisPageProps {
  data: SalesAnalysisResponse | null;
  onResetFilters: () => void;
}

export const SalesAnalysisPage: React.FC<SalesAnalysisPageProps> = ({
  data,
  onResetFilters,
}) => {
  if (!data || data.kpis.record_count === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const { kpis, monthly_trends, yearly_trends, category_breakdown, regional_breakdown, segment_breakdown, monthly_table } = data;

  const monthlyColumns: Column<MonthlyTrendItem>[] = [
    { key: 'period', header: 'Year-Month', sortable: true },
    {
      key: 'sales',
      header: 'Sales ($)',
      sortable: true,
      align: 'right',
      render: r => `$${r.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'profit',
      header: 'Net Profit ($)',
      sortable: true,
      align: 'right',
      render: r => (
        <span className={r.profit >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
          ${r.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'profit_margin',
      header: 'Profit Margin',
      sortable: true,
      align: 'right',
      render: r => `${r.profit_margin.toFixed(2)}%`,
    },
    {
      key: 'orders',
      header: 'Orders',
      sortable: true,
      align: 'right',
      render: r => r.orders.toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Filtered Sales</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${kpis.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Total revenue across {kpis.total_orders.toLocaleString()} orders</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Operating Profit</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            ${kpis.total_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Aggregate net income earned</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Overall Profit Margin</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{kpis.profit_margin.toFixed(2)}%</div>
          <div className="text-xs text-slate-400 mt-1">Net profit as share of sales</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Average Order Value</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${kpis.avg_order_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Average basket transaction size</div>
        </div>
      </div>

      {/* Monthly Sales Trend */}
      <ChartCard
        title="Monthly Sales Progression"
        subtitle="Chronological sequence of sales revenue (Jan 2014 - Dec 2017)"
        badge="USD ($)"
      >
        <SalesTrendChart data={monthly_trends} height={300} />
      </ChartCard>

      {/* Yearly YoY Performance Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Year-over-Year Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {yearly_trends.map(yt => (
            <div key={yt.year} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-sm font-bold text-slate-800">Fiscal Year {yt.year}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">${yt.sales.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-medium">Profit: ${yt.profit.toLocaleString()}</div>

              {yt.growth_sales_pct !== null && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sales Growth:</span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      yt.growth_sales_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {yt.growth_sales_pct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {yt.growth_sales_pct.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category and Regional Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Sales by Category"
          subtitle="Revenue and profit breakdown per product category"
        >
          <CategoryChart data={category_breakdown} />
        </ChartCard>

        <ChartCard
          title="Sales by Region"
          subtitle="Regional distribution of revenue and operating profit"
        >
          <RegionalChart data={regional_breakdown} />
        </ChartCard>
      </div>

      {/* Detailed Monthly Summary Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            Chronological Monthly Performance Ledger
          </h3>
          <span className="text-xs text-slate-500">{monthly_table.length} monthly cycles</span>
        </div>
        <DataTable columns={monthlyColumns} data={monthly_table} pageSize={12} />
      </div>
    </div>
  );
};
