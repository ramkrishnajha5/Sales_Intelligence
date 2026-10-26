import React from 'react';
import { CustomerAnalysisResponse } from '../types/analytics';
import { ChartCard } from '../components/dashboard/ChartCard';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Users, UserCheck, DollarSign, Repeat, ShieldCheck } from 'lucide-react';

interface CustomerAnalysisPageProps {
  data: CustomerAnalysisResponse | null;
  onResetFilters: () => void;
}

export const CustomerAnalysisPage: React.FC<CustomerAnalysisPageProps> = ({
  data,
  onResetFilters,
}) => {
  if (!data || data.unique_customers === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const {
    segment_breakdown,
    top_customers_sales,
    top_customers_profit,
    unique_customers,
    avg_sales_per_customer,
    order_frequency_distribution,
  } = data;

  return (
    <div className="space-y-6">
      {/* Customer KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Unique Customers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{unique_customers.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Distinct client IDs in dataset</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Spend Per Customer</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${avg_sales_per_customer.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Cumulative spend per unique account</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Primary Segment</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {segment_breakdown[0]?.segment || 'Consumer'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Largest revenue generating segment</div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Customer Segment Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {segment_breakdown.map(seg => (
            <div key={seg.segment} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{seg.segment}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {seg.profit_margin.toFixed(1)}% margin
                </span>
              </div>
              <div className="text-lg font-bold text-slate-800 mt-2">${seg.sales.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Profit: ${seg.profit.toLocaleString()}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-200">
                <span>{seg.orders.toLocaleString()} orders</span>
                <span>{seg.customers.toLocaleString()} clients</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers: Profit vs Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 Customers by Net Profit"
          subtitle="Clients who generate the highest cumulative gross profit"
          badge="High Margin"
        >
          <TopProductsChart data={top_customers_profit} metric="profit" height={280} />
        </ChartCard>

        <ChartCard
          title="Top 10 Customers by Total Spend (Sales)"
          subtitle="Clients with the largest aggregate transaction volume"
          badge="Revenue VIPs"
        >
          <TopProductsChart data={top_customers_sales} metric="sales" height={280} />
        </ChartCard>
      </div>

      {/* Order Frequency Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Repeat className="w-4 h-4 text-blue-600" />
          Order Frequency Distribution (Customer Repeat Behavior)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {order_frequency_distribution.map(b => (
            <div key={b.frequency_bucket} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-xs font-semibold text-slate-600">{b.frequency_bucket}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{b.customer_count.toLocaleString()}</div>
              <div className="text-xs text-blue-600 font-medium mt-1">{b.percentage}% of clients</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
