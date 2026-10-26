from fastapi import APIRouter, Depends
from app.schemas import FilterParams, FilterOptions, OverviewResponse, KpiMetrics
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/filters", response_model=FilterOptions)
def get_filters(data=Depends(get_active_data)):
    _, cleaned_df = data
    return AnalyticsService.get_filter_options(cleaned_df)

@router.get("/summary", response_model=OverviewResponse)
def get_dashboard_summary(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    kpis = AnalyticsService.compute_kpis(filtered_df)
    monthly_trends = AnalyticsService.compute_monthly_trends(filtered_df)
    yearly_trends = AnalyticsService.compute_yearly_trends(filtered_df)
    category_breakdown = AnalyticsService.compute_category_breakdown(filtered_df)
    regional_breakdown = AnalyticsService.compute_regional_breakdown(filtered_df)
    top_products = AnalyticsService.compute_top_entities(filtered_df, "Product Name", sort_by="profit", top_n=10)
    top_customers = AnalyticsService.compute_top_entities(filtered_df, "Customer Name", sort_by="profit", top_n=10)
    segment_breakdown = AnalyticsService.compute_segment_breakdown(filtered_df)
    insights = AnalyticsService.generate_insights(filtered_df, kpis)

    return OverviewResponse(
        kpis=kpis,
        monthly_trends=monthly_trends,
        yearly_trends=yearly_trends,
        category_breakdown=category_breakdown,
        regional_breakdown=regional_breakdown,
        top_products=top_products,
        top_customers=top_customers,
        segment_breakdown=segment_breakdown,
        insights=insights,
    )

@router.get("/kpis", response_model=KpiMetrics)
def get_kpis(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)
    return AnalyticsService.compute_kpis(filtered_df)
