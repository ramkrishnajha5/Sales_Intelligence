from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FilterParams(BaseModel):
    years: Optional[List[int]] = None
    regions: Optional[List[str]] = None
    states: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    sub_categories: Optional[List[str]] = None
    segments: Optional[List[str]] = None
    ship_modes: Optional[List[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class FilterOptions(BaseModel):
    years: List[int]
    regions: List[str]
    states: List[str]
    categories: List[str]
    sub_categories: List[str]
    segments: List[str]
    ship_modes: List[str]
    min_date: str
    max_date: str
    total_records: int

class KpiMetrics(BaseModel):
    total_sales: float
    total_profit: float
    profit_margin: float
    total_orders: int
    total_customers: int
    avg_order_value: float
    record_count: int

class MonthlyTrendItem(BaseModel):
    period: str  # YYYY-MM
    sales: float
    profit: float
    orders: int
    profit_margin: float

class YearlyTrendItem(BaseModel):
    year: int
    sales: float
    profit: float
    orders: int
    growth_sales_pct: Optional[float] = None
    growth_profit_pct: Optional[float] = None

class CategoryBreakdownItem(BaseModel):
    category: str
    sales: float
    profit: float
    quantity: int
    orders: int
    profit_margin: float

class SubCategoryBreakdownItem(BaseModel):
    category: str
    sub_category: str
    sales: float
    profit: float
    quantity: int
    orders: int
    profit_margin: float

class RegionalBreakdownItem(BaseModel):
    region: str
    sales: float
    profit: float
    orders: int
    customers: int
    profit_margin: float

class StateBreakdownItem(BaseModel):
    state: str
    region: str
    sales: float
    profit: float
    orders: int
    profit_margin: float

class TopEntityItem(BaseModel):
    name: str
    sales: float
    profit: float
    orders: int
    secondary: Optional[str] = None

class SegmentBreakdownItem(BaseModel):
    segment: str
    sales: float
    profit: float
    orders: int
    customers: int
    profit_margin: float

class KeyInsight(BaseModel):
    id: str
    type: str  # 'positive', 'warning', 'info', 'highlight'
    title: str
    description: str
    metric: Optional[str] = None

class OverviewResponse(BaseModel):
    kpis: KpiMetrics
    monthly_trends: List[MonthlyTrendItem]
    yearly_trends: List[YearlyTrendItem]
    category_breakdown: List[CategoryBreakdownItem]
    regional_breakdown: List[RegionalBreakdownItem]
    top_products: List[TopEntityItem]
    top_customers: List[TopEntityItem]
    segment_breakdown: List[SegmentBreakdownItem]
    insights: List[KeyInsight]

class SalesAnalysisResponse(BaseModel):
    kpis: KpiMetrics
    monthly_trends: List[MonthlyTrendItem]
    yearly_trends: List[YearlyTrendItem]
    category_breakdown: List[CategoryBreakdownItem]
    regional_breakdown: List[RegionalBreakdownItem]
    segment_breakdown: List[SegmentBreakdownItem]
    monthly_table: List[MonthlyTrendItem]
    insights: List[KeyInsight]

class ProductAnalysisResponse(BaseModel):
    category_breakdown: List[CategoryBreakdownItem]
    sub_category_breakdown: List[SubCategoryBreakdownItem]
    top_products_sales: List[TopEntityItem]
    top_products_profit: List[TopEntityItem]
    least_profitable_products: List[TopEntityItem]
    discount_profit_scatter: List[Dict[str, Any]]
    product_table: List[Dict[str, Any]]
    insights: List[KeyInsight]

class RegionalAnalysisResponse(BaseModel):
    regional_breakdown: List[RegionalBreakdownItem]
    top_states_sales: List[StateBreakdownItem]
    top_states_profit: List[StateBreakdownItem]
    least_profitable_states: List[StateBreakdownItem]
    category_by_region: List[Dict[str, Any]]
    state_table: List[StateBreakdownItem]
    insights: List[KeyInsight]

class CustomerAnalysisResponse(BaseModel):
    segment_breakdown: List[SegmentBreakdownItem]
    top_customers_sales: List[TopEntityItem]
    top_customers_profit: List[TopEntityItem]
    unique_customers: int
    avg_sales_per_customer: float
    order_frequency_distribution: List[Dict[str, Any]]
    insights: List[KeyInsight]

class LogisticsAnalysisResponse(BaseModel):
    ship_mode_breakdown: List[Dict[str, Any]]
    shipping_days_distribution: List[Dict[str, Any]]
    avg_shipping_days: float
    discount_distribution: List[Dict[str, Any]]
    correlation_matrix: Dict[str, Dict[str, float]]
    numerical_stats: Dict[str, Dict[str, float]]
    insights: List[KeyInsight]

class OutlierSummary(BaseModel):
    column: str
    q1: float
    q3: float
    iqr: float
    lower_bound: float
    upper_bound: float
    outlier_count: int
    outlier_percentage: float

class DataQualityResponse(BaseModel):
    raw_rows: int
    cleaned_rows: int
    total_columns: int
    columns: List[Dict[str, str]]
    missing_values_raw: Dict[str, int]
    missing_values_cleaned: Dict[str, int]
    duplicate_rows_count: int
    date_parsing_status: str
    engineered_features: List[str]
    outliers: List[OutlierSummary]
    summary_stats: Dict[str, Dict[str, float]]

class DataPreviewResponse(BaseModel):
    total_rows: int
    page: int
    page_size: int
    total_pages: int
    rows: List[Dict[str, Any]]

class ForecastRequest(BaseModel):
    periods_ahead: int = Field(default=6, ge=1, le=24)
    train_ratio: float = Field(default=0.8, ge=0.5, le=0.95)

class ForecastPoint(BaseModel):
    period: str
    actual: Optional[float] = None
    baseline_predicted: Optional[float] = None
    model_predicted: Optional[float] = None
    is_future: bool

class ForecastResponse(BaseModel):
    model_name: str
    features_used: List[str]
    train_points_count: int
    test_points_count: int
    baseline_mae: float
    baseline_rmse: float
    model_mae: float
    model_rmse: float
    forecast_points: List[ForecastPoint]
    interpretation: str
