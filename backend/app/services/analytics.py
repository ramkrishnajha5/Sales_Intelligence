import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from app.schemas import (
    FilterParams, FilterOptions, KpiMetrics, MonthlyTrendItem, YearlyTrendItem,
    CategoryBreakdownItem, SubCategoryBreakdownItem, RegionalBreakdownItem,
    StateBreakdownItem, TopEntityItem, SegmentBreakdownItem, KeyInsight
)

class AnalyticsService:
    @staticmethod
    def get_filter_options(df: pd.DataFrame) -> FilterOptions:
        """Extracts available unique filter values and date boundaries from dataset."""
        years = sorted([int(y) for y in df["Year"].dropna().unique()]) if "Year" in df.columns else []
        regions = sorted([str(r) for r in df["Region"].dropna().unique()]) if "Region" in df.columns else []
        states = sorted([str(s) for s in df["State"].dropna().unique()]) if "State" in df.columns else []
        categories = sorted([str(c) for c in df["Category"].dropna().unique()]) if "Category" in df.columns else []
        sub_categories = sorted([str(sc) for sc in df["Sub-Category"].dropna().unique()]) if "Sub-Category" in df.columns else []
        segments = sorted([str(seg) for seg in df["Segment"].dropna().unique()]) if "Segment" in df.columns else []
        ship_modes = sorted([str(sm) for sm in df["Ship Mode"].dropna().unique()]) if "Ship Mode" in df.columns else []

        min_date = df["Order Date"].min().strftime("%Y-%m-%d") if not df.empty and pd.notnull(df["Order Date"].min()) else ""
        max_date = df["Order Date"].max().strftime("%Y-%m-%d") if not df.empty and pd.notnull(df["Order Date"].max()) else ""

        return FilterOptions(
            years=years,
            regions=regions,
            states=states,
            categories=categories,
            sub_categories=sub_categories,
            segments=segments,
            ship_modes=ship_modes,
            min_date=min_date,
            max_date=max_date,
            total_records=len(df),
        )

    @staticmethod
    def filter_dataframe(df: pd.DataFrame, params: FilterParams) -> pd.DataFrame:
        """Applies multi-dimensional filtering to the cleaned dataframe."""
        filtered = df.copy()

        if params.years and len(params.years) > 0:
            filtered = filtered[filtered["Year"].isin(params.years)]

        if params.regions and len(params.regions) > 0:
            filtered = filtered[filtered["Region"].isin(params.regions)]

        if params.states and len(params.states) > 0:
            filtered = filtered[filtered["State"].isin(params.states)]

        if params.categories and len(params.categories) > 0:
            filtered = filtered[filtered["Category"].isin(params.categories)]

        if params.sub_categories and len(params.sub_categories) > 0:
            filtered = filtered[filtered["Sub-Category"].isin(params.sub_categories)]

        if params.segments and len(params.segments) > 0:
            filtered = filtered[filtered["Segment"].isin(params.segments)]

        if params.ship_modes and len(params.ship_modes) > 0:
            filtered = filtered[filtered["Ship Mode"].isin(params.ship_modes)]

        if params.start_date:
            try:
                start_dt = pd.to_datetime(params.start_date)
                filtered = filtered[filtered["Order Date"] >= start_dt]
            except Exception:
                pass

        if params.end_date:
            try:
                end_dt = pd.to_datetime(params.end_date)
                filtered = filtered[filtered["Order Date"] <= end_dt]
            except Exception:
                pass

        return filtered

    @staticmethod
    def compute_kpis(df: pd.DataFrame) -> KpiMetrics:
        """Computes core business KPIs without averaging row-level percentages."""
        if df.empty:
            return KpiMetrics(
                total_sales=0.0,
                total_profit=0.0,
                profit_margin=0.0,
                total_orders=0,
                total_customers=0,
                avg_order_value=0.0,
                record_count=0
            )

        total_sales = float(df["Sales"].sum())
        total_profit = float(df["Profit"].sum())
        profit_margin = float((total_profit / total_sales) * 100.0) if total_sales > 0 else 0.0
        total_orders = int(df["Order ID"].nunique())
        total_customers = int(df["Customer ID"].nunique())
        avg_order_val = float(total_sales / total_orders) if total_orders > 0 else 0.0

        return KpiMetrics(
            total_sales=round(total_sales, 2),
            total_profit=round(total_profit, 2),
            profit_margin=round(profit_margin, 2),
            total_orders=total_orders,
            total_customers=total_customers,
            avg_order_value=round(avg_order_val, 2),
            record_count=len(df),
        )

    @staticmethod
    def compute_monthly_trends(df: pd.DataFrame) -> List[MonthlyTrendItem]:
        """Calculates chronological monthly sales and profit aggregates."""
        if df.empty:
            return []

        grouped = df.groupby("YearMonth").agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            orders=("Order ID", "nunique")
        ).reset_index().sort_values("YearMonth", ascending=True)

        items = []
        for _, row in grouped.iterrows():
            s = float(row["sales"])
            p = float(row["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(MonthlyTrendItem(
                period=str(row["YearMonth"]),
                sales=round(s, 2),
                profit=round(p, 2),
                orders=int(row["orders"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_yearly_trends(df: pd.DataFrame) -> List[YearlyTrendItem]:
        """Calculates yearly aggregates with period-over-period growth rates."""
        if df.empty:
            return []

        grouped = df.groupby("Year").agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            orders=("Order ID", "nunique")
        ).reset_index().sort_values("Year", ascending=True)

        items: List[YearlyTrendItem] = []
        prev_sales = None
        prev_profit = None

        for _, row in grouped.iterrows():
            curr_sales = float(row["sales"])
            curr_profit = float(row["profit"])

            growth_s = round(float((curr_sales - prev_sales) / prev_sales * 100.0), 2) if prev_sales and prev_sales > 0 else None
            growth_p = round(float((curr_profit - prev_profit) / abs(prev_profit) * 100.0), 2) if prev_profit is not None and prev_profit != 0 else None

            items.append(YearlyTrendItem(
                year=int(row["Year"]),
                sales=round(curr_sales, 2),
                profit=round(curr_profit, 2),
                orders=int(row["orders"]),
                growth_sales_pct=growth_s,
                growth_profit_pct=growth_p,
            ))
            prev_sales = curr_sales
            prev_profit = curr_profit

        return items

    @staticmethod
    def compute_category_breakdown(df: pd.DataFrame) -> List[CategoryBreakdownItem]:
        if df.empty:
            return []
        grouped = df.groupby("Category").agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            quantity=("Quantity", "sum"),
            orders=("Order ID", "nunique")
        ).reset_index().sort_values("sales", ascending=False)

        items = []
        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(CategoryBreakdownItem(
                category=str(r["Category"]),
                sales=round(s, 2),
                profit=round(p, 2),
                quantity=int(r["quantity"]),
                orders=int(r["orders"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_sub_category_breakdown(df: pd.DataFrame) -> List[SubCategoryBreakdownItem]:
        if df.empty:
            return []
        grouped = df.groupby(["Category", "Sub-Category"]).agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            quantity=("Quantity", "sum"),
            orders=("Order ID", "nunique")
        ).reset_index().sort_values("sales", ascending=False)

        items = []
        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(SubCategoryBreakdownItem(
                category=str(r["Category"]),
                sub_category=str(r["Sub-Category"]),
                sales=round(s, 2),
                profit=round(p, 2),
                quantity=int(r["quantity"]),
                orders=int(r["orders"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_regional_breakdown(df: pd.DataFrame) -> List[RegionalBreakdownItem]:
        if df.empty:
            return []
        grouped = df.groupby("Region").agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            orders=("Order ID", "nunique"),
            customers=("Customer ID", "nunique")
        ).reset_index().sort_values("sales", ascending=False)

        items = []
        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(RegionalBreakdownItem(
                region=str(r["Region"]),
                sales=round(s, 2),
                profit=round(p, 2),
                orders=int(r["orders"]),
                customers=int(r["customers"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_state_breakdown(df: pd.DataFrame) -> List[StateBreakdownItem]:
        if df.empty:
            return []
        grouped = df.groupby(["State", "Region"]).agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            orders=("Order ID", "nunique")
        ).reset_index().sort_values("sales", ascending=False)

        items = []
        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(StateBreakdownItem(
                state=str(r["State"]),
                region=str(r["Region"]),
                sales=round(s, 2),
                profit=round(p, 2),
                orders=int(r["orders"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_segment_breakdown(df: pd.DataFrame) -> List[SegmentBreakdownItem]:
        if df.empty:
            return []
        grouped = df.groupby("Segment").agg(
            sales=("Sales", "sum"),
            profit=("Profit", "sum"),
            orders=("Order ID", "nunique"),
            customers=("Customer ID", "nunique")
        ).reset_index().sort_values("sales", ascending=False)

        items = []
        for _, r in grouped.iterrows():
            s = float(r["sales"])
            p = float(r["profit"])
            margin = float((p / s) * 100.0) if s > 0 else 0.0
            items.append(SegmentBreakdownItem(
                segment=str(r["Segment"]),
                sales=round(s, 2),
                profit=round(p, 2),
                orders=int(r["orders"]),
                customers=int(r["customers"]),
                profit_margin=round(margin, 2),
            ))
        return items

    @staticmethod
    def compute_top_entities(df: pd.DataFrame, group_col: str, sort_by: str = "profit", top_n: int = 10, ascending: bool = False, secondary_col: Optional[str] = None) -> List[TopEntityItem]:
        if df.empty or group_col not in df.columns:
            return []

        agg_dict = {
            "Sales": "sum",
            "Profit": "sum",
            "Order ID": "nunique"
        }
        if secondary_col and secondary_col in df.columns:
            agg_dict[secondary_col] = "first"

        grouped = df.groupby(group_col).agg(agg_dict).reset_index()

        col_sort = "Profit" if sort_by.lower() == "profit" else "Sales"
        grouped = grouped.sort_values(col_sort, ascending=ascending).head(top_n)

        items = []
        for _, r in grouped.iterrows():
            items.append(TopEntityItem(
                name=str(r[group_col]),
                sales=round(float(r["Sales"]), 2),
                profit=round(float(r["Profit"]), 2),
                orders=int(r["Order ID"]),
                secondary=str(r[secondary_col]) if secondary_col and secondary_col in r else None
            ))
        return items

    @staticmethod
    def generate_insights(df: pd.DataFrame, kpis: KpiMetrics) -> List[KeyInsight]:
        """Dynamically produces grounded, data-driven business insights."""
        insights: List[KeyInsight] = []
        if df.empty:
            return [KeyInsight(id="no_data", type="warning", title="No Active Data", description="No records matched the selected filters.")]

        # 1. Profit Margin Health
        if kpis.profit_margin >= 15.0:
            insights.append(KeyInsight(
                id="margin_healthy",
                type="positive",
                title="Strong Overall Profit Margin",
                description=f"Current filtered margin stands at {kpis.profit_margin}%, indicating robust pricing and operational discipline.",
                metric=f"{kpis.profit_margin}%"
            ))
        elif kpis.profit_margin >= 8.0:
            insights.append(KeyInsight(
                id="margin_moderate",
                type="info",
                title="Moderate Profit Margin",
                description=f"Current profit margin is {kpis.profit_margin}%. Profitability is steady but discount optimization could expand margins.",
                metric=f"{kpis.profit_margin}%"
            ))
        else:
            insights.append(KeyInsight(
                id="margin_low",
                type="warning",
                title="Compressed Profit Margins",
                description=f"Filtered profit margin is only {kpis.profit_margin}%. High discount rates or unprofitable product mixes are causing profit leakage.",
                metric=f"{kpis.profit_margin}%"
            ))

        # 2. Category Driver
        cat_grouped = df.groupby("Category").agg(sales=("Sales", "sum"), profit=("Profit", "sum")).reset_index()
        if not cat_grouped.empty:
            top_sales_cat = cat_grouped.sort_values("sales", ascending=False).iloc[0]
            top_profit_cat = cat_grouped.sort_values("profit", ascending=False).iloc[0]
            cat_margin = (top_profit_cat["profit"] / top_profit_cat["sales"] * 100) if top_profit_cat["sales"] > 0 else 0
            insights.append(KeyInsight(
                id="top_category",
                type="highlight",
                title=f"Category Leader: {top_profit_cat['Category']}",
                description=f"{top_profit_cat['Category']} delivers the highest profit (${top_profit_cat['profit']:,.2f}) with a {cat_margin:.1f}% profit margin.",
                metric=f"${top_profit_cat['profit']:,.0f}"
            ))

        # 3. Sub-Category Loss Warning
        sub_grouped = df.groupby("Sub-Category").agg(profit=("Profit", "sum"), sales=("Sales", "sum")).reset_index()
        loss_subs = sub_grouped[sub_grouped["profit"] < 0].sort_values("profit", ascending=True)
        if not loss_subs.empty:
            worst_sub = loss_subs.iloc[0]
            insights.append(KeyInsight(
                id="subcat_loss",
                type="warning",
                title=f"Profit Drag: {worst_sub['Sub-Category']}",
                description=f"Sub-category '{worst_sub['Sub-Category']}' incurred a net loss of -${abs(worst_sub['profit']):,.2f} despite ${worst_sub['sales']:,.2f} in sales.",
                metric=f"-${abs(worst_sub['profit']):,.0f}"
            ))

        # 4. Discount Impact Analysis
        if "Discount" in df.columns:
            high_discount = df[df["Discount"] >= 0.2]
            low_discount = df[df["Discount"] < 0.2]
            if len(high_discount) > 0 and len(low_discount) > 0:
                high_disc_margin = (high_discount["Profit"].sum() / high_discount["Sales"].sum() * 100) if high_discount["Sales"].sum() > 0 else 0
                low_disc_margin = (low_discount["Profit"].sum() / low_discount["Sales"].sum() * 100) if low_discount["Sales"].sum() > 0 else 0
                insights.append(KeyInsight(
                    id="discount_sensitivity",
                    type="info",
                    title="Discount Sensitivity Insight",
                    description=f"Orders with <20% discount yield a {low_disc_margin:.1f}% margin, whereas orders with ≥20% discount achieve only {high_disc_margin:.1f}%.",
                    metric=f"{low_disc_margin:.1f}% vs {high_disc_margin:.1f}%"
                ))

        # 5. Top Region
        reg_grouped = df.groupby("Region").agg(sales=("Sales", "sum"), profit=("Profit", "sum")).reset_index()
        if not reg_grouped.empty:
            top_reg = reg_grouped.sort_values("profit", ascending=False).iloc[0]
            insights.append(KeyInsight(
                id="top_region",
                type="positive",
                title=f"Top Profit Region: {top_reg['Region']}",
                description=f"{top_reg['Region']} region generates ${top_reg['profit']:,.2f} in net profit, leading all geographic sectors.",
                metric=f"${top_reg['profit']:,.0f}"
            ))

        return insights
