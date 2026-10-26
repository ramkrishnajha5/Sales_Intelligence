import React from 'react';
import { Download, Upload, RefreshCw, Database, Sparkles } from 'lucide-react';
import { NavPage } from './Sidebar';

interface TopbarProps {
  currentPage: NavPage;
  onRefresh: () => void;
  onExportCsv: () => void;
  onOpenDatasetModal: () => void;
  dateRangeStr?: string;
}

const pageTitles: Record<NavPage, { title: string; category: string }> = {
  overview: { title: 'Executive Overview', category: 'Executive Dashboard' },
  sales: { title: 'Sales Performance & Growth', category: 'Revenue Analytics' },
  products: { title: 'Product & Category Intelligence', category: 'Catalog Operations' },
  regions: { title: 'Geographic & Regional Performance', category: 'Market Expansion' },
  customers: { title: 'Customer Segmentation & Value', category: 'Client Operations' },
  logistics: { title: 'Logistics, Shipping & Statistical Analysis', category: 'Supply Chain' },
  explorer: { title: 'Data Explorer & Quality Audit', category: 'Data Management' },
  datascience: { title: 'Data Science & Machine Learning Forecasting', category: 'Predictive Modeling' },
};

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  onRefresh,
  onExportCsv,
  onOpenDatasetModal,
  dateRangeStr = '2014-01-03 to 2017-12-30',
}) => {
  const pageInfo = pageTitles[currentPage] || { title: 'Dashboard', category: 'Analytics' };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Breadcrumb */}
      <div>
        <div className="text-[11px] font-medium text-slate-400">
          Sales Intelligence / <span className="text-slate-600 font-semibold">{pageInfo.category}</span>
        </div>
        <div className="text-sm font-bold text-slate-800">{pageInfo.title}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* Date range pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateRangeStr}</span>
        </div>

        {/* Datasets & Samples Modal Trigger */}
        <button
          onClick={onOpenDatasetModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          title="Switch sample datasets or upload custom CSV"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Datasets &amp; Samples</span>
        </button>

        {/* Export CSV Button */}
        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          title="Download filtered dataset as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
};
