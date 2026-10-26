from typing import Optional, List
from fastapi import Query
from app.schemas import FilterParams
from app.services.data_loader import dataset_manager

def get_filter_params(
    years: Optional[List[int]] = Query(None, description="List of order years"),
    regions: Optional[List[str]] = Query(None, description="List of regions"),
    states: Optional[List[str]] = Query(None, description="List of states"),
    categories: Optional[List[str]] = Query(None, description="List of categories"),
    sub_categories: Optional[List[str]] = Query(None, description="List of sub-categories"),
    segments: Optional[List[str]] = Query(None, description="List of customer segments"),
    ship_modes: Optional[List[str]] = Query(None, description="List of shipping modes"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
) -> FilterParams:
    return FilterParams(
        years=years,
        regions=regions,
        states=states,
        categories=categories,
        sub_categories=sub_categories,
        segments=segments,
        ship_modes=ship_modes,
        start_date=start_date,
        end_date=end_date,
    )

def get_active_data():
    return dataset_manager.get_data()
