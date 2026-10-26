import numpy as np
import pandas as pd
from typing import Dict, Any, List
from app.schemas import KeyInsight

class StatisticsService:
    @staticmethod
    def compute_logistics_and_stats(df: pd.DataFrame) -> Dict[str, Any]:
        """Calculates shipping mode metrics, latency distributions, correlation matrix, and summary statistics."""
        if df.empty:
            return {
                "ship_mode_breakdown": [],
                "shipping_days_distribution": [],
                "avg_shipping_days": 0.0,
                "discount_distribution": [],
                "correlation_matrix": {},
                "numerical_stats": {},
                "insights": [],
            }

        # 1. Shipping Mode Breakdown
        ship_mode_grp = df.groupby("Ship Mode").agg(
            orders=("Order ID", "nunique"),
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            avg_days=("Order Processing Days", "mean")
        ).reset_index().sort_values("orders", ascending=False)

        ship_mode_breakdown = []
        for _, r in ship_mode_grp.iterrows():
            ship_mode_breakdown.append({
                "ship_mode": str(r["Ship Mode"]),
                "orders": int(r["orders"]),
                "sales": round(float(r["sales"]), 2),
                "profit": round(float(r["profit"]), 2),
                "avg_days": round(float(r["avg_days"]), 2),
            })

        # 2. Shipping Days Frequency
        days_counts = df["Order Processing Days"].value_counts().sort_index()
        shipping_days_dist = [
            {"days": int(day), "count": int(count)}
            for day, count in days_counts.items()
        ]
        avg_shipping_days = round(float(df["Order Processing Days"].mean()), 2)

        # 3. Discount Distribution Bins
        def get_discount_bracket(d: float) -> str:
            if d == 0:
                return "0% (No Discount)"
            elif d <= 0.15:
                return "1% - 15%"
            elif d <= 0.30:
                return "16% - 30%"
            elif d <= 0.50:
                return "31% - 50%"
            else:
                return "> 50%"

        discount_brackets = df["Discount"].apply(get_discount_bracket).value_counts().reset_index()
        discount_brackets.columns = ["bracket", "count"]
        # Also compute sales & profit per bracket
        bracket_stats = df.assign(bracket=df["Discount"].apply(get_discount_bracket)).groupby("bracket").agg(
            orders=("Order ID", "nunique"),
            sales=("Sales", "sum"),
            profit=("Profit", "sum")
        ).reset_index()

        discount_dist = []
        for _, r in bracket_stats.iterrows():
            discount_dist.append({
                "bracket": str(r["bracket"]),
                "orders": int(r["orders"]),
                "sales": round(float(r["sales"]), 2),
                "profit": round(float(r["profit"]), 2),
            })

        # 4. Correlation Matrix
        numeric_cols = ["Sales", "Quantity", "Discount", "Profit", "Order Processing Days"]
        present_cols = [c for c in numeric_cols if c in df.columns]
        corr_df = df[present_cols].corr()

        corr_matrix: Dict[str, Dict[str, float]] = {}
        for row_col in present_cols:
            corr_matrix[row_col] = {}
            for col_col in present_cols:
                val = corr_df.loc[row_col, col_col]
                corr_matrix[row_col][col_col] = round(float(val), 3) if pd.notnull(val) else 0.0

        # 5. Summary Statistics
        num_stats: Dict[str, Dict[str, float]] = {}
        for c in present_cols:
            s = df[c].dropna()
            if len(s) > 0:
                num_stats[c] = {
                    "count": float(len(s)),
                    "mean": round(float(s.mean()), 2),
                    "std": round(float(s.std()), 2) if len(s) > 1 else 0.0,
                    "min": round(float(s.min()), 2),
                    "q25": round(float(np.percentile(s, 25)), 2),
                    "median": round(float(s.median()), 2),
                    "q75": round(float(np.percentile(s, 75)), 2),
                    "max": round(float(s.max()), 2),
                }

        # 6. Logistics & Statistical Insights
        disc_profit_corr = corr_matrix.get("Discount", {}).get("Profit", 0.0)
        insights = [
            KeyInsight(
                id="logistics_pref",
                type="info",
                title=f"Dominant Shipping: {ship_mode_breakdown[0]['ship_mode'] if ship_mode_breakdown else 'N/A'}",
                description=f"Standard shipping handles the overwhelming majority of orders, averaging {avg_shipping_days} days in transit.",
                metric=f"{avg_shipping_days} Days"
            ),
            KeyInsight(
                id="disc_profit_correlation",
                type="warning" if disc_profit_corr < -0.15 else "info",
                title=f"Discount & Profit Correlation: {disc_profit_corr}",
                description=f"A negative correlation of {disc_profit_corr} suggests that higher promotional discounts are statistically associated with reduced net profits. Note: This indicates association, not strict univariate causality.",
                metric=str(disc_profit_corr)
            ),
        ]

        return {
            "ship_mode_breakdown": ship_mode_breakdown,
            "shipping_days_distribution": shipping_days_dist,
            "avg_shipping_days": avg_shipping_days,
            "discount_distribution": discount_dist,
            "correlation_matrix": corr_matrix,
            "numerical_stats": num_stats,
            "insights": insights,
        }
