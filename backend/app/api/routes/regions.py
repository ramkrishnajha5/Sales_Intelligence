from fastapi import APIRouter, Depends
from app.schemas import FilterParams, RegionalAnalysisResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/regions", tags=["Regions"])

@router.get("/analysis", response_model=RegionalAnalysisResponse)
def get_regional_analysis(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    regional_breakdown = AnalyticsService.compute_regional_breakdown(filtered_df)
    state_breakdown = AnalyticsService.compute_state_breakdown(filtered_df)

    top_states_sales = sorted(state_breakdown, key=lambda x: x.sales, reverse=True)[:10]
    top_states_profit = sorted(state_breakdown, key=lambda x: x.profit, reverse=True)[:10]
    least_profitable_states = sorted(state_breakdown, key=lambda x: x.profit)[:10]

    # Category by region matrix
    category_by_region = []
    if not filtered_df.empty:
        cat_reg = filtered_df.groupby(["Region", "Category"]).agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum")
        ).reset_index()

        for _, r in cat_reg.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            category_by_region.append({
                "region": str(r["Region"]),
                "category": str(r["Category"]),
                "sales": round(s, 2),
                "profit": round(p, 2),
                "profit_margin": round(margin, 2),
            })

    kpis = AnalyticsService.compute_kpis(filtered_df)
    insights = AnalyticsService.generate_insights(filtered_df, kpis)

    return RegionalAnalysisResponse(
        regional_breakdown=regional_breakdown,
        top_states_sales=top_states_sales,
        top_states_profit=top_states_profit,
        least_profitable_states=least_profitable_states,
        category_by_region=category_by_region,
        state_table=state_breakdown,
        insights=insights,
    )
