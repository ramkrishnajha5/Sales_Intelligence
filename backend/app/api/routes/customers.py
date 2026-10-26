from fastapi import APIRouter, Depends
from app.schemas import FilterParams, CustomerAnalysisResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/analysis", response_model=CustomerAnalysisResponse)
def get_customer_analysis(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    segment_breakdown = AnalyticsService.compute_segment_breakdown(filtered_df)
    top_customers_sales = AnalyticsService.compute_top_entities(
        filtered_df, "Customer Name", sort_by="sales", top_n=10, secondary_col="Segment"
    )
    top_customers_profit = AnalyticsService.compute_top_entities(
        filtered_df, "Customer Name", sort_by="profit", top_n=10, secondary_col="Segment"
    )

    unique_customers = int(filtered_df["Customer ID"].nunique()) if not filtered_df.empty else 0
    total_sales = float(filtered_df["Sales"].sum()) if not filtered_df.empty else 0.0
    avg_sales_per_customer = round(float(total_sales / unique_customers), 2) if unique_customers > 0 else 0.0

    # Order frequency distribution
    order_freq_dist = []
    if not filtered_df.empty:
        cust_orders = filtered_df.groupby("Customer ID")["Order ID"].nunique()
        bins = {
            "1 Order": int((cust_orders == 1).sum()),
            "2-3 Orders": int(((cust_orders >= 2) & (cust_orders <= 3)).sum()),
            "4-5 Orders": int(((cust_orders >= 4) & (cust_orders <= 5)).sum()),
            "6+ Orders": int((cust_orders >= 6).sum()),
        }
        for k, v in bins.items():
            order_freq_dist.append({
                "frequency_bucket": k,
                "customer_count": v,
                "percentage": round(float(v / unique_customers * 100), 1) if unique_customers > 0 else 0.0
            })

    kpis = AnalyticsService.compute_kpis(filtered_df)
    insights = AnalyticsService.generate_insights(filtered_df, kpis)

    return CustomerAnalysisResponse(
        segment_breakdown=segment_breakdown,
        top_customers_sales=top_customers_sales,
        top_customers_profit=top_customers_profit,
        unique_customers=unique_customers,
        avg_sales_per_customer=avg_sales_per_customer,
        order_frequency_distribution=order_freq_dist,
        insights=insights,
    )
