import {
  FilterParams,
  FilterOptions,
  OverviewResponse,
  SalesAnalysisResponse,
  ProductAnalysisResponse,
  RegionalAnalysisResponse,
  CustomerAnalysisResponse,
  LogisticsAnalysisResponse,
  DataPreviewResponse,
  DataQualityResponse,
  ForecastResponse,
  DatasetMetadata,
  SampleDataset,
} from '../types/analytics';

const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? `${(import.meta as any).env.VITE_API_URL}/api`
  : '/api';

function buildQuery(params?: FilterParams, extra?: Record<string, any>): string {
  const query = new URLSearchParams();

  if (params) {
    if (params.years && params.years.length > 0) {
      params.years.forEach(y => query.append('years', y.toString()));
    }
    if (params.regions && params.regions.length > 0) {
      params.regions.forEach(r => query.append('regions', r));
    }
    if (params.states && params.states.length > 0) {
      params.states.forEach(s => query.append('states', s));
    }
    if (params.categories && params.categories.length > 0) {
      params.categories.forEach(c => query.append('categories', c));
    }
    if (params.sub_categories && params.sub_categories.length > 0) {
      params.sub_categories.forEach(sc => query.append('sub_categories', sc));
    }
    if (params.segments && params.segments.length > 0) {
      params.segments.forEach(seg => query.append('segments', seg));
    }
    if (params.ship_modes && params.ship_modes.length > 0) {
      params.ship_modes.forEach(sm => query.append('ship_modes', sm));
    }
    if (params.start_date) query.set('start_date', params.start_date);
    if (params.end_date) query.set('end_date', params.end_date);
  }

  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.set(k, v.toString());
      }
    });
  }

  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let errorMsg = `Server error ${res.status}: ${res.statusText}`;
      try {
        const body = await res.json();
        if (body.detail) errorMsg = body.detail;
      } catch {
        // fallback to statusText
      }
      throw new Error(errorMsg);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to Python FastAPI backend at http://localhost:8000. Please verify the backend is running.');
    }
    throw err;
  }
}

export const api = {
  getHealth: () => request<{ status: string; app_name: string; version: string; dataset_loaded: string; records: number }>('/health'),
  getMetadata: () => request<DatasetMetadata>('/metadata'),
  getFilters: () => request<FilterOptions>('/filters'),
  getDashboardSummary: (filters?: FilterParams) => request<OverviewResponse>(`/dashboard/summary${buildQuery(filters)}`),
  getSalesAnalysis: (filters?: FilterParams) => request<SalesAnalysisResponse>(`/sales/analysis${buildQuery(filters)}`),
  getProductAnalysis: (filters?: FilterParams, sortMetric: string = 'profit') =>
    request<ProductAnalysisResponse>(`/products/analysis${buildQuery(filters, { sort_metric: sortMetric })}`),
  getRegionalAnalysis: (filters?: FilterParams) => request<RegionalAnalysisResponse>(`/regions/analysis${buildQuery(filters)}`),
  getCustomerAnalysis: (filters?: FilterParams) => request<CustomerAnalysisResponse>(`/customers/analysis${buildQuery(filters)}`),
  getLogisticsAnalysis: (filters?: FilterParams) => request<LogisticsAnalysisResponse>(`/logistics/analysis${buildQuery(filters)}`),
  
  getDataPreview: (filters?: FilterParams, page: number = 1, pageSize: number = 20, sortBy?: string, sortOrder?: string, search?: string) =>
    request<DataPreviewResponse>(`/data/preview${buildQuery(filters, { page, page_size: pageSize, sort_by: sortBy, sort_order: sortOrder, search })}`),
  
  getDataQuality: () => request<DataQualityResponse>('/data/quality'),
  
  getExportUrl: (filters?: FilterParams) => `${API_BASE}/data/export${buildQuery(filters)}`,
  
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ status: string; message: string; rows_loaded: number; columns: number }>('/data/upload', {
      method: 'POST',
      body: formData,
    });
  },

  resetDataset: () => request<{ status: string; message: string; metadata: DatasetMetadata }>('/data/reset', { method: 'POST' }),

  getForecast: (periodsAhead: number = 6, trainRatio: number = 0.8) =>
    request<ForecastResponse>('/data-science/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periods_ahead: periodsAhead, train_ratio: trainRatio }),
    }),

  getSamples: () => request<SampleDataset[]>('/data/samples'),

  loadSample: (sampleId: string) =>
    request<{ status: string; message: string; metadata: DatasetMetadata }>(`/data/load-sample/${sampleId}`, {
      method: 'POST',
    }),

  getDownloadSampleUrl: (sampleId: string) => `${API_BASE}/data/download-sample/${sampleId}`,
};
