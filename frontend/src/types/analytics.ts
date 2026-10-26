export interface FilterParams {
  years?: number[];
  regions?: string[];
  states?: string[];
  categories?: string[];
  sub_categories?: string[];
  segments?: string[];
  ship_modes?: string[];
  start_date?: string;
  end_date?: string;
}

export interface FilterOptions {
  years: number[];
  regions: string[];
  states: string[];
  categories: string[];
  sub_categories: string[];
  segments: string[];
  ship_modes: string[];
  min_date: string;
  max_date: string;
  total_records: number;
}

export interface KpiMetrics {
  total_sales: number;
  total_profit: number;
  profit_margin: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
  record_count: number;
}

export interface MonthlyTrendItem {
  period: string; // YYYY-MM
  sales: number;
  profit: number;
  orders: number;
  profit_margin: number;
}

export interface YearlyTrendItem {
  year: number;
  sales: number;
  profit: number;
  orders: number;
  growth_sales_pct: number | null;
  growth_profit_pct: number | null;
}

export interface CategoryBreakdownItem {
  category: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
  profit_margin: number;
}

export interface SubCategoryBreakdownItem {
  category: string;
  sub_category: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
  profit_margin: number;
}

export interface RegionalBreakdownItem {
  region: string;
  sales: number;
  profit: number;
  orders: number;
  customers: number;
  profit_margin: number;
}

export interface StateBreakdownItem {
  state: string;
  region: string;
  sales: number;
  profit: number;
  orders: number;
  profit_margin: number;
}

export interface TopEntityItem {
  name: string;
  sales: number;
  profit: number;
  orders: number;
  secondary?: string | null;
}

export interface SegmentBreakdownItem {
  segment: string;
  sales: number;
  profit: number;
  orders: number;
  customers: number;
  profit_margin: number;
}

export interface KeyInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'highlight';
  title: string;
  description: string;
  metric?: string | null;
}

export interface OverviewResponse {
  kpis: KpiMetrics;
  monthly_trends: MonthlyTrendItem[];
  yearly_trends: YearlyTrendItem[];
  category_breakdown: CategoryBreakdownItem[];
  regional_breakdown: RegionalBreakdownItem[];
  top_products: TopEntityItem[];
  top_customers: TopEntityItem[];
  segment_breakdown: SegmentBreakdownItem[];
  insights: KeyInsight[];
}

export interface SalesAnalysisResponse {
  kpis: KpiMetrics;
  monthly_trends: MonthlyTrendItem[];
  yearly_trends: YearlyTrendItem[];
  category_breakdown: CategoryBreakdownItem[];
  regional_breakdown: RegionalBreakdownItem[];
  segment_breakdown: SegmentBreakdownItem[];
  monthly_table: MonthlyTrendItem[];
  insights: KeyInsight[];
}

export interface ProductAnalysisResponse {
  category_breakdown: CategoryBreakdownItem[];
  sub_category_breakdown: SubCategoryBreakdownItem[];
  top_products_sales: TopEntityItem[];
  top_products_profit: TopEntityItem[];
  least_profitable_products: TopEntityItem[];
  discount_profit_scatter: Array<{
    product_name: string;
    category: string;
    discount: number;
    profit: number;
    sales: number;
  }>;
  product_table: Array<{
    product_id: string;
    product_name: string;
    category: string;
    sub_category: string;
    sales: number;
    profit: number;
    profit_margin: number;
    quantity: number;
    orders: number;
    avg_discount: number;
  }>;
  insights: KeyInsight[];
}

export interface RegionalAnalysisResponse {
  regional_breakdown: RegionalBreakdownItem[];
  top_states_sales: StateBreakdownItem[];
  top_states_profit: StateBreakdownItem[];
  least_profitable_states: StateBreakdownItem[];
  category_by_region: Array<{
    region: string;
    category: string;
    sales: number;
    profit: number;
    profit_margin: number;
  }>;
  state_table: StateBreakdownItem[];
  insights: KeyInsight[];
}

export interface CustomerAnalysisResponse {
  segment_breakdown: SegmentBreakdownItem[];
  top_customers_sales: TopEntityItem[];
  top_customers_profit: TopEntityItem[];
  unique_customers: number;
  avg_sales_per_customer: number;
  order_frequency_distribution: Array<{
    frequency_bucket: string;
    customer_count: number;
    percentage: number;
  }>;
  insights: KeyInsight[];
}

export interface LogisticsAnalysisResponse {
  ship_mode_breakdown: Array<{
    ship_mode: string;
    orders: number;
    sales: number;
    profit: number;
    avg_days: number;
  }>;
  shipping_days_distribution: Array<{
    days: number;
    count: number;
  }>;
  avg_shipping_days: number;
  discount_distribution: Array<{
    bracket: string;
    orders: number;
    sales: number;
    profit: number;
  }>;
  correlation_matrix: Record<string, Record<string, number>>;
  numerical_stats: Record<string, {
    count: number;
    mean: number;
    std: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    max: number;
  }>;
  insights: KeyInsight[];
}

export interface OutlierSummary {
  column: string;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  outlier_count: number;
  outlier_percentage: number;
}

export interface DataQualityResponse {
  raw_rows: number;
  cleaned_rows: number;
  total_columns: number;
  columns: Array<{ name: string; type: string }>;
  missing_values_raw: Record<string, number>;
  missing_values_cleaned: Record<string, number>;
  duplicate_rows_count: number;
  date_parsing_status: string;
  engineered_features: string[];
  outliers: OutlierSummary[];
  summary_stats: Record<string, {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
  }>;
}

export interface DataPreviewResponse {
  total_rows: number;
  page: number;
  page_size: number;
  total_pages: number;
  rows: Record<string, any>[];
}

export interface ForecastPoint {
  period: string;
  actual: number | null;
  baseline_predicted: number | null;
  model_predicted: number | null;
  is_future: boolean;
}

export interface ForecastResponse {
  model_name: string;
  features_used: string[];
  train_points_count: number;
  test_points_count: number;
  baseline_mae: number;
  baseline_rmse: number;
  model_mae: number;
  model_rmse: number;
  forecast_points: ForecastPoint[];
  interpretation: string;
}

export interface DatasetMetadata {
  source: string;
  sample_id?: string;
  filename: string;
  display_name?: string;
  is_default: boolean;
  row_count: number;
  column_count: number;
  last_loaded: string | null;
}

export interface SampleDataset {
  id: string;
  name: string;
  filename: string;
  description: string;
  is_default: boolean;
}

