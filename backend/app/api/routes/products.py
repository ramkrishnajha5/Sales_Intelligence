from fastapi import APIRouter, Depends, Query
from typing import Optional
import numpy as np
from app.schemas import FilterParams, ProductAnalysisResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/analysis", response_model=ProductAnalysisResponse)
def get_product_analysis(
    params: FilterParams = Depends(get_filter_params),
    sort_metric: Optional[str] = Query("profit", description="Ranking metric: sales, profit, or quantity"),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    category_breakdown = AnalyticsService.compute_category_breakdown(filtered_df)
    sub_category_breakdown = AnalyticsService.compute_sub_category_breakdown(filtered_df)

    top_products_sales = AnalyticsService.compute_top_entities(
        filtered_df, "Product Name", sort_by="sales", top_n=10, secondary_col="Category"
    )
    top_products_profit = AnalyticsService.compute_top_entities(
        filtered_df, "Product Name", sort_by="profit", top_n=10, ascending=False, secondary_col="Category"
    )
    least_profitable_products = AnalyticsService.compute_top_entities(
        filtered_df, "Product Name", sort_by="profit", top_n=10, ascending=True, secondary_col="Category"
    )

    # Sample discount vs profit scatter data (aggregate or sample to avoid overloading frontend)
    scatter_data = []
    if not filtered_df.empty:
        # Sample up to 150 points for scatter rendering
        sample_df = filtered_df.sample(min(150, len(filtered_df)), random_state=42)
        for _, row in sample_df.iterrows():
            scatter_data.append({
                "product_name": str(row["Product Name"])[:30],
                "category": str(row["Category"]),
                "discount": round(float(row["Discount"]) * 100, 1),
                "profit": round(float(row["Profit"]), 2),
                "sales": round(float(row["Sales"]), 2),
            })

    # Sortable product performance table
    product_table = []
    if not filtered_df.empty:
        grouped = filtered_df.groupby(["Product ID", "Product Name", "Category", "Sub-Category"]).agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            quantity=("Quantity", "sum"),
            orders=("Order ID", "nunique"),
            avg_discount=("Discount", "mean")
        ).reset_index()

        col_sort = "profit" if sort_metric.lower() == "profit" else ("quantity" if sort_metric.lower() == "quantity" else "sales")
        grouped = grouped.sort_values(col_sort, ascending=False).head(50)

        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            product_table.append({
                "product_id": str(r["Product ID"]),
                "product_name": str(r["Product Name"]),
                "category": str(r["Category"]),
                "sub_category": str(r["Sub-Category"]),
                "sales": round(s, 2),
                "profit": round(p, 2),
                "profit_margin": round(margin, 2),
                "quantity": int(r["quantity"]),
                "orders": int(r["orders"]),
                "avg_discount": round(float(r["avg_discount"]) * 100, 1),
            })

    kpis = AnalyticsService.compute_kpis(filtered_df)
    insights = AnalyticsService.generate_insights(filtered_df, kpis)

    return ProductAnalysisResponse(
        category_breakdown=category_breakdown,
        sub_category_breakdown=sub_category_breakdown,
        top_products_sales=top_products_sales,
        top_products_profit=top_products_profit,
        least_profitable_products=least_profitable_products,
        discount_profit_scatter=scatter_data,
        product_table=product_table,
        insights=insights,
    )
