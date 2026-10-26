import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
from app.schemas import ForecastResponse, ForecastPoint

class ForecastingService:
    @staticmethod
    def generate_sales_forecast(df: pd.DataFrame, periods_ahead: int = 6, train_ratio: float = 0.8) -> ForecastResponse:
        """Trains a chronological time-series regression model to forecast monthly sales.
        
        Strict Data Science Standards:
        - Monthly aggregation
        - Strictly chronological train/test split (no future data leakage)
        - Baseline model: Lag-1 rolling average
        - Supervised features: Time trend index, Lag-1 sales, Lag-2 sales, Month seasonality sine/cosine
        - Out-of-sample evaluation: MAE and RMSE
        """
        if df.empty:
            raise ValueError("Dataset is empty. Cannot generate forecast.")

        # Aggregate sales by month chronologically
        monthly = df.groupby("YearMonth").agg(
            sales=("Sales", "sum")
        ).reset_index().sort_values("YearMonth", ascending=True)

        if len(monthly) < 12:
            raise ValueError(f"Insufficient historical data ({len(monthly)} monthly points). At least 12 months required for reliable time-series modeling.")

        # Feature Engineering for Time-Series Regression
        ts_df = monthly.copy()
        ts_df["trend"] = np.arange(len(ts_df))
        ts_df["lag_1"] = ts_df["sales"].shift(1)
        ts_df["lag_2"] = ts_df["sales"].shift(2)
        
        # Monthly seasonality component
        dates = pd.to_datetime(ts_df["YearMonth"] + "-01")
        ts_df["month_sin"] = np.sin(2 * np.pi * dates.dt.month / 12)
        ts_df["month_cos"] = np.cos(2 * np.pi * dates.dt.month / 12)

        # Drop the initial 2 lag NaN rows
        valid_df = ts_df.dropna().reset_index(drop=True)
        n = len(valid_df)

        split_idx = int(np.floor(n * train_ratio))
        if split_idx >= n:
            split_idx = n - 2
        if split_idx < 4:
            split_idx = 4

        train_data = valid_df.iloc[:split_idx].copy()
        test_data = valid_df.iloc[split_idx:].copy()

        feature_cols = ["trend", "lag_1", "lag_2", "month_sin", "month_cos"]
        X_train = train_data[feature_cols]
        y_train = train_data["sales"]
        X_test = test_data[feature_cols]
        y_test = test_data["sales"]

        # 1. Baseline Model: Naive persistence (lag_1)
        y_baseline_pred = test_data["lag_1"]
        baseline_mae = float(mean_absolute_error(y_test, y_baseline_pred))
        baseline_rmse = float(root_mean_squared_error(y_test, y_baseline_pred))

        # 2. Regression Model: Ridge Regression (with positive weight bias)
        model = Ridge(alpha=1.0)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        # Ensure predicted sales are non-negative
        y_pred = np.maximum(0, y_pred)

        model_mae = float(mean_absolute_error(y_test, y_pred))
        model_rmse = float(root_mean_squared_error(y_test, y_pred))

        # Build output points
        points: List[ForecastPoint] = []

        # Historical training points
        for _, row in train_data.iterrows():
            points.append(ForecastPoint(
                period=str(row["YearMonth"]),
                actual=round(float(row["sales"]), 2),
                baseline_predicted=None,
                model_predicted=None,
                is_future=False
            ))

        # Test points (evaluation comparison)
        for i, (_, row) in enumerate(test_data.iterrows()):
            points.append(ForecastPoint(
                period=str(row["YearMonth"]),
                actual=round(float(row["sales"]), 2),
                baseline_predicted=round(float(y_baseline_pred.iloc[i]), 2),
                model_predicted=round(float(y_pred[i]), 2),
                is_future=False
            ))

        # 3. Multi-step autoregressive future forecast
        last_row = valid_df.iloc[-1]
        curr_trend = float(last_row["trend"])
        last_sales_1 = float(last_row["sales"])
        last_sales_2 = float(last_row["lag_1"])

        last_dt = pd.to_datetime(last_row["YearMonth"] + "-01")

        for step in range(1, periods_ahead + 1):
            future_dt = last_dt + pd.DateOffset(months=step)
            future_period = future_dt.strftime("%Y-%m")
            curr_trend += 1.0
            month_sin = np.sin(2 * np.pi * future_dt.month / 12)
            month_cos = np.cos(2 * np.pi * future_dt.month / 12)

            feat_vector = pd.DataFrame([{
                "trend": curr_trend,
                "lag_1": last_sales_1,
                "lag_2": last_sales_2,
                "month_sin": month_sin,
                "month_cos": month_cos,
            }])

            pred_future_sales = float(max(0.0, model.predict(feat_vector)[0]))

            points.append(ForecastPoint(
                period=future_period,
                actual=None,
                baseline_predicted=None,
                model_predicted=round(pred_future_sales, 2),
                is_future=True
            ))

            # Update autoregressive lags
            last_sales_2 = last_sales_1
            last_sales_1 = pred_future_sales

        interp = (
            f"Model: Ridge Regression (L2 regularization) with trend, lag-1, lag-2, and sinusoidal monthly seasonality. "
            f"Evaluated on {len(test_data)} chronologically held-out test months. "
            f"Model RMSE is ${model_rmse:,.2f} (compared to Naive Baseline RMSE of ${baseline_rmse:,.2f}). "
            f"Future forecasts represent statistical estimations based on historical momentum and seasonal patterns."
        )

        return ForecastResponse(
            model_name="Ridge Regression Time-Series Forecaster",
            features_used=feature_cols,
            train_points_count=len(train_data),
            test_points_count=len(test_data),
            baseline_mae=round(baseline_mae, 2),
            baseline_rmse=round(baseline_rmse, 2),
            model_mae=round(model_mae, 2),
            model_rmse=round(model_rmse, 2),
            forecast_points=points,
            interpretation=interp
        )
