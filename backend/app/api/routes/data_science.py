from fastapi import APIRouter, Depends, HTTPException
from app.schemas import DataQualityResponse, ForecastRequest, ForecastResponse
from app.dependencies import get_active_data
from app.services.preprocessing import DataPreprocessor
from app.services.forecasting import ForecastingService

router = APIRouter(prefix="/data-science", tags=["Data Science & ML"])

@router.get("/summary", response_model=DataQualityResponse)
def get_data_science_summary(data=Depends(get_active_data)):
    """Returns preprocessing, feature engineering, and statistical summary for syllabus demonstration."""
    raw_df, cleaned_df = data
    return DataPreprocessor.get_quality_report(raw_df, cleaned_df)

@router.post("/forecast", response_model=ForecastResponse)
def generate_forecast(
    request: ForecastRequest,
    data=Depends(get_active_data)
):
    """Generates an honest, strictly chronological time-series sales forecast using scikit-learn."""
    _, cleaned_df = data
    try:
        return ForecastingService.generate_sales_forecast(
            cleaned_df,
            periods_ahead=request.periods_ahead,
            train_ratio=request.train_ratio
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
