import pytest
import pandas as pd
from app.services.data_loader import dataset_manager
from app.services.preprocessing import DataPreprocessor

def test_dataset_loading_and_columns():
    raw_df, cleaned_df = dataset_manager.load_default()
    assert len(cleaned_df) > 0
    assert "Sales" in cleaned_df.columns
    assert "Profit" in cleaned_df.columns
    assert "Order Date" in cleaned_df.columns
    assert "Ship Date" in cleaned_df.columns
    assert "Year" in cleaned_df.columns
    assert "Month" in cleaned_df.columns
    assert "Quarter" in cleaned_df.columns
    assert "Order Processing Days" in cleaned_df.columns

def test_missing_column_validation():
    invalid_df = pd.DataFrame({"Some Col": [1, 2, 3]})
    missing = DataPreprocessor.validate_columns(invalid_df)
    assert len(missing) > 0
    assert "Sales" in missing

def test_quality_report():
    raw_df, cleaned_df = dataset_manager.get_data()
    report = DataPreprocessor.get_quality_report(raw_df, cleaned_df)
    assert report.cleaned_rows > 0
    assert len(report.outliers) > 0
    assert "Sales" in report.summary_stats
