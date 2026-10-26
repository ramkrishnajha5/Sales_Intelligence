from fastapi import APIRouter, Depends
from app.schemas import FilterParams, LogisticsAnalysisResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService
from app.services.statistics import StatisticsService

router = APIRouter(prefix="/logistics", tags=["Logistics & Statistics"])

@router.get("/analysis", response_model=LogisticsAnalysisResponse)
def get_logistics_analysis(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)
    result = StatisticsService.compute_logistics_and_stats(filtered_df)
    return LogisticsAnalysisResponse(**result)
