import React, { useState, useEffect } from 'react';
import {
  DataPreviewResponse,
  DataQualityResponse,
  FilterParams,
  DatasetMetadata,
} from '../types/analytics';
import { api } from '../services/api';
import { DataTable, Column } from '../components/tables/DataTable';
import {
  Database,
  Search,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  ListFilter,
} from 'lucide-react';

interface DataExplorerPageProps {
  filters: FilterParams;
  metadata: DatasetMetadata | null;
  onRefreshData: () => void;
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({
  filters,
  metadata,
  onRefreshData,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('Order Date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [preview, setPreview] = useState<DataPreviewResponse | null>(null);
  const [quality, setQuality] = useState<DataQualityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prevData, qualData] = await Promise.all([
        api.getDataPreview(filters, page, pageSize, sortBy, sortOrder, search),
        api.getDataQuality(),
      ]);
      setPreview(prevData);
      setQuality(qualData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dataset details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page, pageSize, sortBy, sortOrder, search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading and preprocessing CSV...');
    try {
      const res = await api.uploadDataset(file);
      setUploadStatus(`Success: ${res.message}`);
      onRefreshData();
      fetchData();
    } catch (err: any) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  const handleResetDefault = async () => {
    try {
      await api.resetDataset();
      setUploadStatus('Reset to default Sample Superstore CSV.');
      onRefreshData();
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const exportUrl = api.getExportUrl(filters);

  // Dynamic preview table columns
  const tableColumns: Column<any>[] = preview && preview.rows.length > 0
    ? Object.keys(preview.rows[0])
        .filter(k => !['Row ID'].includes(k))
        .map(key => ({
          key,
          header: key,
          sortable: true,
          render: r => {
            const val = r[key];
            if (val === null || val === undefined) return <span className="text-slate-300">—</span>;
            if (key === 'Sales' || key === 'Profit') {
              return `$${Number(val).toFixed(2)}`;
            }
            if (key === 'Discount') {
              return `${(Number(val) * 100).toFixed(0)}%`;
            }
            if (key === 'Row Profit Margin') {
              return `${(Number(val) * 100).toFixed(1)}%`;
            }
            return String(val);
          },
        }))
    : [];

  return (
    <div className="space-y-6">
      {/* Overview Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Dataset</div>
          <div className="text-base font-bold text-slate-900 mt-1 truncate" title={metadata?.filename}>
            {metadata?.filename || 'Sample - Superstore.csv'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {metadata?.is_default ? 'Standard Superstore Repository' : 'Custom Upload'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Records</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {quality ? quality.cleaned_rows.toLocaleString() : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Raw rows: {quality ? quality.raw_rows.toLocaleString() : '—'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Dataset Dimensions</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {quality ? quality.total_columns : 0} Columns
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {quality?.engineered_features.length || 0} engineered features
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Duplicate Records</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {quality ? quality.duplicate_rows_count : 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Exact row duplicate count</div>
        </div>
      </div>

      {/* Dataset Controls & Upload Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Dataset Management & Upload</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom CSV retail data with standard Superstore columns or reset to original.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {!metadata?.is_default && (
            <button
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Default CSV
            </button>
          )}

          <a
            href={exportUrl}
            download="filtered_superstore_data.csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Filtered CSV
          </a>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium">
          {uploadStatus}
        </div>
      )}

      {/* Required Columns Info Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">Required Superstore Schema Columns: </span>
        Order ID, Order Date, Ship Date, Ship Mode, Customer ID, Customer Name, Segment, City, State, Region, Product ID, Category, Sub-Category, Product Name, Sales, Quantity, Discount, Profit.
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer, product, or location..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {preview && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Showing Page {preview.page} of {preview.total_pages} ({preview.total_rows.toLocaleString()} filtered records)
            </span>
          </div>

          <DataTable
            columns={tableColumns}
            data={preview.rows}
            pageSize={pageSize}
            emptyMessage={loading ? 'Loading records...' : 'No records match search criteria'}
          />

          {/* Server-side Pagination controls */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <div>Total matching: {preview.total_rows.toLocaleString()} rows</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-semibold text-slate-800">
                Page {preview.page} / {preview.total_pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(preview.total_pages, p + 1))}
                disabled={page >= preview.total_pages}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
