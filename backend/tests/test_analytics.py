import pytest
from app.services.data_loader import dataset_manager
from app.services.analytics import AnalyticsService
from app.schemas import FilterParams

def test_kpi_calculations_and_profit_margin():
    _, df = dataset_manager.get_data()
    kpis = AnalyticsService.compute_kpis(df)

    assert kpis.total_sales > 0
    assert kpis.total_profit > 0
    assert kpis.total_orders > 0
    assert kpis.total_customers > 0

    # Ensure profit margin formula is strictly sum(Profit)/sum(Sales)*100
    expected_margin = round((df["Profit"].sum() / df["Sales"].sum()) * 100, 2)
    assert kpis.profit_margin == expected_margin

    # Ensure unique orders & customers match nunique
    assert kpis.total_orders == int(df["Order ID"].nunique())
    assert kpis.total_customers == int(df["Customer ID"].nunique())

def test_filtering_logic():
    _, df = dataset_manager.get_data()
    
    # Filter by Region
    params = FilterParams(regions=["West"])
    filtered = AnalyticsService.filter_dataframe(df, params)
    assert len(filtered) > 0
    assert (filtered["Region"] == "West").all()

    # Filter by Category
    params_cat = FilterParams(categories=["Technology"])
    filtered_cat = AnalyticsService.filter_dataframe(df, params_cat)
    assert len(filtered_cat) > 0
    assert (filtered_cat["Category"] == "Technology").all()

def test_empty_filter_results():
    _, df = dataset_manager.get_data()
    params = FilterParams(regions=["NonExistentRegion123"])
    filtered = AnalyticsService.filter_dataframe(df, params)
    assert len(filtered) == 0

    kpis = AnalyticsService.compute_kpis(filtered)
    assert kpis.total_sales == 0.0
    assert kpis.total_profit == 0.0
    assert kpis.profit_margin == 0.0
    assert kpis.total_orders == 0
    assert kpis.total_customers == 0
    assert kpis.avg_order_value == 0.0
