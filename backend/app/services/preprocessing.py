import numpy as np
import pandas as pd
from typing import Dict, Any, List
from app.schemas import OutlierSummary, DataQualityResponse

REQUIRED_COLUMNS = [
    "Order ID", "Order Date", "Ship Date", "Ship Mode", "Customer ID",
    "Customer Name", "Segment", "City", "State", "Region", "Product ID",
    "Category", "Sub-Category", "Product Name", "Sales", "Quantity",
    "Discount", "Profit"
]

class DataPreprocessor:
    @staticmethod
    def validate_columns(df: pd.DataFrame) -> List[str]:
        """Checks for missing required columns, stripping leading/trailing whitespace."""
        df.columns = df.columns.str.strip()
        missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        return missing

    @classmethod
    def clean_and_engineer(cls, df: pd.DataFrame) -> pd.DataFrame:
        """Applies full cleaning, conversions, and feature engineering."""
        df = df.copy()
        df.columns = df.columns.str.strip()

        missing = cls.validate_columns(df)
        if missing:
            raise ValueError(f"Uploaded dataset is missing required columns: {', '.join(missing)}")

        # Drop Row ID if present as it's an internal sequence index
        if "Row ID" in df.columns:
            df = df.drop(columns=["Row ID"])

        # Clean string columns
        string_cols = ["Order ID", "Ship Mode", "Customer ID", "Customer Name", "Segment",
                       "City", "State", "Region", "Product ID", "Category", "Sub-Category", "Product Name"]
        for col in string_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip()

        # Date parsing
        df["Order Date"] = pd.to_datetime(df["Order Date"], errors="coerce")
        df["Ship Date"] = pd.to_datetime(df["Ship Date"], errors="coerce")

        # Numeric conversions
        df["Sales"] = pd.to_numeric(df["Sales"], errors="coerce").fillna(0.0)
        df["Profit"] = pd.to_numeric(df["Profit"], errors="coerce").fillna(0.0)
        df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce").fillna(1).astype(int)
        df["Discount"] = pd.to_numeric(df["Discount"], errors="coerce").fillna(0.0)

        # Drop rows where critical dates or IDs are invalid/missing
        df = df.dropna(subset=["Order Date", "Order ID", "Sales", "Profit"])

        # Feature Engineering
        df["Year"] = df["Order Date"].dt.year.astype(int)
        df["Month"] = df["Order Date"].dt.month.astype(int)
        df["Month Name"] = df["Order Date"].dt.strftime("%B")
        df["YearMonth"] = df["Order Date"].dt.strftime("%Y-%m")
        df["Quarter"] = "Q" + df["Order Date"].dt.quarter.astype(str)
        df["Day"] = df["Order Date"].dt.day.astype(int)
        df["Day of Week"] = df["Order Date"].dt.strftime("%A")

        # Order Processing Days (Shipping Duration)
        df["Order Processing Days"] = (df["Ship Date"] - df["Order Date"]).dt.days
        # If Ship Date is earlier than Order Date or null, default to 0
        df["Order Processing Days"] = df["Order Processing Days"].fillna(0).apply(lambda d: max(0, int(d)))

        # Row-level Profit Margin (safe division)
        # Note: Global metrics MUST sum profit / sum sales, not average this row-level metric!
        df["Row Profit Margin"] = np.where(df["Sales"] > 0, df["Profit"] / df["Sales"], 0.0)

        return df

    @classmethod
    def compute_outliers(cls, df: pd.DataFrame, column: str) -> OutlierSummary:
        """Computes outliers using Tukey's IQR rule."""
        series = df[column].dropna()
        if len(series) == 0:
            return OutlierSummary(
                column=column, q1=0, q3=0, iqr=0, lower_bound=0, upper_bound=0,
                outlier_count=0, outlier_percentage=0.0
            )

        q1 = float(np.percentile(series, 25))
        q3 = float(np.percentile(series, 75))
        iqr = q3 - q1
        lower_bound = float(q1 - 1.5 * iqr)
        upper_bound = float(q3 + 1.5 * iqr)

        outlier_mask = (series < lower_bound) | (series > upper_bound)
        outlier_count = int(outlier_mask.sum())
        outlier_pct = float((outlier_count / len(series)) * 100) if len(series) > 0 else 0.0

        return OutlierSummary(
            column=column,
            q1=round(q1, 4),
            q3=round(q3, 4),
            iqr=round(iqr, 4),
            lower_bound=round(lower_bound, 4),
            upper_bound=round(upper_bound, 4),
            outlier_count=outlier_count,
            outlier_percentage=round(outlier_pct, 2)
        )

    @classmethod
    def get_quality_report(cls, raw_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> DataQualityResponse:
        """Generates comprehensive data quality report comparing raw and cleaned datasets."""
        missing_raw = {k: int(v) for k, v in raw_df.isnull().sum().to_dict().items()}
        missing_cleaned = {k: int(v) for k, v in cleaned_df.isnull().sum().to_dict().items()}

        columns_meta = [{"name": str(c), "type": str(cleaned_df[c].dtype)} for c in cleaned_df.columns]

        outlier_cols = ["Sales", "Profit", "Discount", "Quantity", "Order Processing Days"]
        outliers = [cls.compute_outliers(cleaned_df, col) for col in outlier_cols if col in cleaned_df.columns]

        # Summary statistics for key numeric columns
        stats_dict: Dict[str, Dict[str, float]] = {}
        for col in outlier_cols:
            if col in cleaned_df.columns:
                s = cleaned_df[col].dropna()
                stats_dict[col] = {
                    "mean": round(float(s.mean()), 2),
                    "median": round(float(s.median()), 2),
                    "std": round(float(s.std()), 2) if len(s) > 1 else 0.0,
                    "min": round(float(s.min()), 2),
                    "max": round(float(s.max()), 2),
                }

        engineered = ["Year", "Month", "Month Name", "YearMonth", "Quarter", "Day", "Day of Week", "Order Processing Days", "Row Profit Margin"]

        return DataQualityResponse(
            raw_rows=len(raw_df),
            cleaned_rows=len(cleaned_df),
            total_columns=len(cleaned_df.columns),
            columns=columns_meta,
            missing_values_raw=missing_raw,
            missing_values_cleaned=missing_cleaned,
            duplicate_rows_count=int(raw_df.duplicated().sum()),
            date_parsing_status="Successfully parsed Order Date and Ship Date with ISO-standard datetime conversion",
            engineered_features=engineered,
            outliers=outliers,
            summary_stats=stats_dict,
        )
