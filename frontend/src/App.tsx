import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NavPage } from './components/layout/Sidebar';
import {
  FilterParams,
  FilterOptions,
  OverviewResponse,
  SalesAnalysisResponse,
  ProductAnalysisResponse,
  RegionalAnalysisResponse,
  CustomerAnalysisResponse,
  LogisticsAnalysisResponse,
  DatasetMetadata,
} from './types/analytics';
import { api } from './services/api';
import { LoadingState } from './components/dashboard/LoadingState';
import { ErrorState } from './components/dashboard/ErrorState';

import { OverviewPage } from './pages/OverviewPage';
import { SalesAnalysisPage } from './pages/SalesAnalysisPage';
import { ProductAnalysisPage } from './pages/ProductAnalysisPage';
import { RegionalAnalysisPage } from './pages/RegionalAnalysisPage';
import { CustomerAnalysisPage } from './pages/CustomerAnalysisPage';
import { LogisticsAnalysisPage } from './pages/LogisticsAnalysisPage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { DataSciencePage } from './pages/DataSciencePage';
import { DatasetModal } from './components/dashboard/DatasetModal';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);

  // Page datasets
  const [overviewData, setOverviewData] = useState<OverviewResponse | null>(null);
  const [salesData, setSalesData] = useState<SalesAnalysisResponse | null>(null);
  const [productData, setProductData] = useState<ProductAnalysisResponse | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalAnalysisResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerAnalysisResponse | null>(null);
  const [logisticsData, setLogisticsData] = useState<LogisticsAnalysisResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);

  // Fetch filter options and metadata on initial load
  const loadInitialMeta = useCallback(async () => {
    try {
      const [opts, meta] = await Promise.all([api.getFilters(), api.getMetadata()]);
      setFilterOptions(opts);
      setMetadata(meta);
    } catch (err: any) {
      console.error('Failed to load initial metadata:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialMeta();
  }, [loadInitialMeta]);

  // Load page specific data based on active page and filters
  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (currentPage) {
        case 'overview': {
          const res = await api.getDashboardSummary(filters);
          setOverviewData(res);
          break;
        }
        case 'sales': {
          const res = await api.getSalesAnalysis(filters);
          setSalesData(res);
          break;
        }
        case 'products': {
          const res = await api.getProductAnalysis(filters);
          setProductData(res);
          break;
        }
        case 'regions': {
          const res = await api.getRegionalAnalysis(filters);
          setRegionalData(res);
          break;
        }
        case 'customers': {
          const res = await api.getCustomerAnalysis(filters);
          setCustomerData(res);
          break;
        }
        case 'logistics': {
          const res = await api.getLogisticsAnalysis(filters);
          setLogisticsData(res);
          break;
        }
        case 'explorer':
        case 'datascience':
          // These pages handle their own localized fetching
          break;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching analytics from the Python backend.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleRefresh = () => {
    loadInitialMeta();
    loadPageData();
  };

  const handleExportCsv = () => {
    const url = api.getExportUrl(filters);
    window.open(url, '_blank');
  };

  const handleUploadCsv = async (file: File) => {
    setIsUploading(true);
    setUploadNotification(null);
    try {
      const res = await api.uploadDataset(file);
      setUploadNotification(res.message);
      await loadInitialMeta();
      await loadPageData();
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Determine current matching record count
  const matchingRecords =
    overviewData?.kpis.record_count ??
    salesData?.kpis.record_count ??
    filterOptions?.total_records;

  return (
    <>
      <AppShell
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        filterOptions={filterOptions}
        filters={filters}
        matchingRecords={matchingRecords}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        onRefresh={handleRefresh}
        onExportCsv={handleExportCsv}
        onUploadCsv={handleUploadCsv}
        metadata={metadata}
        isUploading={isUploading}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
      >
        <DatasetModal
          isOpen={isDatasetModalOpen}
          onClose={() => setIsDatasetModalOpen(false)}
          metadata={metadata}
          onDatasetChanged={handleRefresh}
        />

        {uploadNotification && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <span>{uploadNotification}</span>
          <button
            onClick={() => setUploadNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={loadPageData} />
      ) : loading && currentPage !== 'explorer' && currentPage !== 'datascience' ? (
        <LoadingState />
      ) : (
        <>
          {currentPage === 'overview' && (
            <OverviewPage data={overviewData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'sales' && (
            <SalesAnalysisPage data={salesData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'products' && (
            <ProductAnalysisPage data={productData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'regions' && (
            <RegionalAnalysisPage data={regionalData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'customers' && (
            <CustomerAnalysisPage data={customerData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'logistics' && (
            <LogisticsAnalysisPage data={logisticsData} onResetFilters={handleResetFilters} />
          )}

          {currentPage === 'explorer' && (
            <DataExplorerPage
              filters={filters}
              metadata={metadata}
              onRefreshData={handleRefresh}
            />
          )}

          {currentPage === 'datascience' && (
            <DataSciencePage onRefreshData={handleRefresh} />
          )}
        </>
      )}
    </AppShell>
    </>
  );
};

export default App;
