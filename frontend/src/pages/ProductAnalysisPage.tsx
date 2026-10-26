import React, { useState } from 'react';
import { ProductAnalysisResponse } from '../types/analytics';
import { ChartCard } from '../components/dashboard/ChartCard';
import { CategoryChart } from '../components/charts/CategoryChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { DiscountScatterChart } from '../components/charts/DiscountScatterChart';
import { DataTable, Column } from '../components/tables/DataTable';
import { EmptyState } from '../components/dashboard/EmptyState';
import { AlertOctagon, TrendingDown, Layers, BarChart2 } from 'lucide-react';

interface ProductAnalysisPageProps {
  data: ProductAnalysisResponse | null;
  onResetFilters: () => void;
  onMetricChange?: (metric: string) => void;
}

export const ProductAnalysisPage: React.FC<ProductAnalysisPageProps> = ({
  data,
  onResetFilters,
}) => {
  const [tableMetric, setTableMetric] = useState<'sales' | 'profit' | 'quantity'>('profit');

  if (!data || data.product_table.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const {
    category_breakdown,
    sub_category_breakdown,
    top_products_sales,
    top_products_profit,
    least_profitable_products,
    discount_profit_scatter,
    product_table,
  } = data;

  const productColumns: Column<any>[] = [
    {
      key: 'product_name',
      header: 'Product Name',
      sortable: true,
      render: r => (
        <div>
          <div className="font-medium text-slate-800 line-clamp-1" title={r.product_name}>
            {r.product_name}
          </div>
          <div className="text-[10px] text-slate-400">
            {r.category} &rsaquo; {r.sub_category}
          </div>
        </div>
      ),
    },
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
      header: 'Margin',
      sortable: true,
      align: 'right',
      render: r => `${r.profit_margin.toFixed(1)}%`,
    },
    {
      key: 'quantity',
      header: 'Units Sold',
      sortable: true,
      align: 'right',
      render: r => r.quantity.toLocaleString(),
    },
    {
      key: 'avg_discount',
      header: 'Avg Discount',
      sortable: true,
      align: 'right',
      render: r => `${r.avg_discount.toFixed(1)}%`,
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
      {/* Category & Sub-Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Sales & Profit by Category"
          subtitle="Revenue and profit breakdown for each major department"
        >
          <CategoryChart data={category_breakdown} />
        </ChartCard>

        <ChartCard
          title="Discount vs. Profitability Correlation"
          subtitle="Transaction scatter plot revealing margin collapse at discounts > 20%"
          badge="Scatter Sample"
        >
          <DiscountScatterChart data={discount_profit_scatter} />
        </ChartCard>
      </div>

      {/* Sub-Category Ledger Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Sub-Category Performance Comparison
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {sub_category_breakdown.map(sc => (
            <div
              key={sc.sub_category}
              className={`rounded-lg p-3 border ${
                sc.profit < 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-slate-800 truncate" title={sc.sub_category}>
                {sc.sub_category}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">${sc.sales.toLocaleString()}</div>
              <div
                className={`text-[11px] font-semibold mt-1 ${
                  sc.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                Profit: ${sc.profit.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{sc.profit_margin.toFixed(1)}% margin</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 by Profit vs Least Profitable Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 Most Profitable Products"
          subtitle="Catalog items generating maximum total net margin"
          badge="High Margin"
        >
          <TopProductsChart data={top_products_profit} metric="profit" />
        </ChartCard>

        <ChartCard
          title="10 Least Profitable Products (Profit Drag)"
          subtitle="Products generating significant cumulative losses due to steep discounting"
          badge="Loss Warnings"
        >
          <TopProductsChart data={least_profitable_products} metric="profit" />
        </ChartCard>
      </div>

      {/* Top Products by Sales */}
      <ChartCard
        title="Top 10 Products by Gross Revenue"
        subtitle="Catalog items with highest gross transaction volume"
        badge="Revenue Leaders"
      >
        <TopProductsChart data={top_products_sales} metric="sales" height={260} />
      </ChartCard>

      {/* Detailed Product Catalog Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Complete Product Catalog Performance
            </h3>
            <p className="text-xs text-slate-500">
              Sortable ledger of product units, margin percentages, and transaction volume
            </p>
          </div>
        </div>
        <DataTable columns={productColumns} data={product_table} pageSize={10} />
      </div>
    </div>
  );
};
