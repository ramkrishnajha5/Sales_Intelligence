from fastapi import APIRouter, Depends
from app.schemas import FilterParams, SalesAnalysisResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.get("/analysis", response_model=SalesAnalysisResponse)
def get_sales_analysis(
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
    segment_breakdown = AnalyticsService.compute_segment_breakdown(filtered_df)
    insights = AnalyticsService.generate_insights(filtered_df, kpis)

    return SalesAnalysisResponse(
        kpis=kpis,
        monthly_trends=monthly_trends,
        yearly_trends=yearly_trends,
        category_breakdown=category_breakdown,
        regional_breakdown=regional_breakdown,
        segment_breakdown=segment_breakdown,
        monthly_table=monthly_trends,
        insights=insights,
    )
