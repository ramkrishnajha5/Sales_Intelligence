import React, { useState } from 'react';
import { Sidebar, NavPage } from './Sidebar';
import { Topbar } from './Topbar';
import { FilterBar } from '../dashboard/FilterBar';
import { FilterParams, FilterOptions, DatasetMetadata } from '../../types/analytics';

interface AppShellProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  filterOptions: FilterOptions | null;
  filters: FilterParams;
  matchingRecords?: number;
  onFilterChange: (filters: FilterParams) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onExportCsv: () => void;
  onUploadCsv: (file: File) => void;
  metadata: DatasetMetadata | null;
  isUploading?: boolean;
  onOpenDatasetModal: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  filterOptions,
  filters,
  matchingRecords,
  onFilterChange,
  onResetFilters,
  onRefresh,
  onExportCsv,
  onUploadCsv,
  metadata,
  isUploading = false,
  onOpenDatasetModal,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const dateRangeStr =
    filterOptions?.min_date && filterOptions?.max_date
      ? `${filterOptions.min_date} to ${filterOptions.max_date}`
      : '2014-01-03 to 2017-12-30';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={page => {
          onNavigate(page);
          setMobileSidebarOpen(false);
        }}
        datasetName={metadata?.filename || 'Sample - Superstore.csv'}
        recordCount={metadata?.row_count || 9994}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar
          currentPage={currentPage}
          onRefresh={onRefresh}
          onExportCsv={onExportCsv}
          onOpenDatasetModal={onOpenDatasetModal}
          dateRangeStr={dateRangeStr}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Filter Bar is shown on all analytics views except Explorer/DataScience where internal tabs apply */}
          {currentPage !== 'explorer' && currentPage !== 'datascience' && (
            <FilterBar
              options={filterOptions}
              filters={filters}
              matchingRecords={matchingRecords}
              onFilterChange={onFilterChange}
              onReset={onResetFilters}
            />
          )}

          {children}
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          Sales Intelligence &bull; Full-Stack Retail Analytics &bull; React + TypeScript + FastAPI + Pandas
        </footer>
      </div>
    </div>
  );
};
