import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingCart,
  Users,
  CreditCard,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { OverviewResponse } from '../types/analytics';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { ProfitTrendChart } from '../components/charts/ProfitTrendChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { RegionalChart } from '../components/charts/RegionalChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { EmptyState } from '../components/dashboard/EmptyState';

interface OverviewPageProps {
  data: OverviewResponse | null;
  onResetFilters: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ data, onResetFilters }) => {
  if (!data || data.kpis.record_count === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const { kpis, monthly_trends, category_breakdown, regional_breakdown, top_products, top_customers, segment_breakdown, insights } = data;

  return (
    <div className="space-y-6">
      {/* 6 Core KPIs: 3 cards per row, 2 rows (3x2) for superior visibility and clean layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <KpiCard
          title="Total Sales"
          value={`$${kpis.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Sum of sales revenue"
          icon={DollarSign}
          badge={{ text: 'Gross Revenue', isNeutral: true }}
          tooltip="Total Sales = sum of Sales"
        />

        <KpiCard
          title="Total Profit"
          value={`$${kpis.total_profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Net operating earnings"
          icon={TrendingUp}
          badge={{
            text: kpis.total_profit >= 0 ? 'Profitable' : 'Loss',
            isPositive: kpis.total_profit >= 0,
          }}
          tooltip="Total Profit = sum of Profit"
        />

        <KpiCard
          title="Profit Margin"
          value={`${kpis.profit_margin.toFixed(2)}%`}
          subtitle="Net profit / Total sales"
          icon={Percent}
          badge={{
            text: kpis.profit_margin >= 12 ? 'Healthy' : 'Below Target',
            isPositive: kpis.profit_margin >= 12,
          }}
          tooltip="Profit Margin = (sum of Profit / sum of Sales) * 100"
        />

        <KpiCard
          title="Total Orders"
          value={kpis.total_orders.toLocaleString()}
          subtitle="Unique transaction IDs"
          icon={ShoppingCart}
          badge={{ text: 'Completed', isNeutral: true }}
          tooltip="Total Orders = count of distinct Order ID values"
        />

        <KpiCard
          title="Total Customers"
          value={kpis.total_customers.toLocaleString()}
          subtitle="Distinct client accounts"
          icon={Users}
          badge={{ text: 'Active Accounts', isNeutral: true }}
          tooltip="Total Customers = count of distinct Customer ID values"
        />

        <KpiCard
          title="Avg Order Value"
          value={`$${kpis.avg_order_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Revenue per distinct order"
          icon={CreditCard}
          badge={{ text: 'AOV', isNeutral: true }}
          tooltip="Average Order Value = Total Sales / Total Orders"
        />
      </div>

      {/* Dynamic Key Insights Strip */}
      {insights && insights.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Real-Time Dynamic Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.slice(0, 3).map(insight => {
              const Icon =
                insight.type === 'positive'
                  ? CheckCircle2
                  : insight.type === 'warning'
                  ? AlertTriangle
                  : Info;
              const iconColor =
                insight.type === 'positive'
                  ? 'text-emerald-400'
                  : insight.type === 'warning'
                  ? 'text-rose-400'
                  : 'text-blue-400';

              return (
                <div key={insight.id} className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/60">
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{insight.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trends Row: Monthly Sales & Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Sales Trend"
          subtitle="Chronological monthly revenue evolution"
          badge="Monthly"
        >
          <SalesTrendChart data={monthly_trends} />
        </ChartCard>

        <ChartCard
          title="Monthly Profit Trend"
          subtitle="Chronological net margin evolution over time"
          badge="Net Profit"
        >
          <ProfitTrendChart data={monthly_trends} />
        </ChartCard>
      </div>

      {/* Breakdown Row: Category & Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Sales & Profit by Category"
          subtitle="Comparative revenue and net margin across main categories"
        >
          <CategoryChart data={category_breakdown} />
        </ChartCard>

        <ChartCard
          title="Regional Performance"
          subtitle="Geographic sales and operating margin contribution"
        >
          <RegionalChart data={regional_breakdown} />
        </ChartCard>
      </div>

      {/* Top 10 Entities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 Most Profitable Products"
          subtitle="Highest net income generating catalog items"
        >
          <TopProductsChart data={top_products} metric="profit" />
        </ChartCard>

        <ChartCard
          title="Top 10 Profitable Customers"
          subtitle="Clients driving maximum cumulative net profit"
        >
          <TopProductsChart data={top_customers} metric="profit" />
        </ChartCard>
      </div>

      {/* Segment Distribution summary */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Customer Segment Contribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {segment_breakdown.map(seg => (
            <div key={seg.segment} className="bg-slate-50 border border-slate-200/70 rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-700">{seg.segment}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">${seg.sales.toLocaleString()}</div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <span>Profit: ${seg.profit.toLocaleString()}</span>
                <span className="font-medium text-emerald-600">{seg.profit_margin.toFixed(1)}% margin</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
