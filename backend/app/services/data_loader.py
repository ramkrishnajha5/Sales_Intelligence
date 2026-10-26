import os
import io
import threading
from pathlib import Path
from typing import Optional, Tuple, List, Dict, Any
import pandas as pd
from app.config import settings

class DatasetManager:
    """Manages the in-memory dataset lifecycle (default dataset, preset sample datasets, custom uploads)."""
    def __init__(self):
        self._lock = threading.Lock()
        self._raw_df: Optional[pd.DataFrame] = None
        self._cleaned_df: Optional[pd.DataFrame] = None
        self._metadata: dict = {
            "source": "default",
            "sample_id": "default",
            "filename": "Sample - Superstore.csv",
            "display_name": "Sample - Superstore (Original)",
            "is_default": True,
            "row_count": 0,
            "column_count": 0,
            "last_loaded": None,
        }

    def _read_csv_safe(self, file_source) -> pd.DataFrame:
        """Reads CSV trying utf-8, windows-1252, and latin1 encodings."""
        encodings = ["utf-8", "windows-1252", "latin1"]
        last_err = None
        for enc in encodings:
            try:
                if isinstance(file_source, (str, Path)):
                    return pd.read_csv(file_source, encoding=enc)
                elif isinstance(file_source, bytes):
                    return pd.read_csv(io.BytesIO(file_source), encoding=enc)
                else:
                    file_source.seek(0)
                    return pd.read_csv(file_source, encoding=enc)
            except UnicodeDecodeError as e:
                last_err = e
                continue
            except Exception as e:
                raise ValueError(f"Failed to parse CSV file: {str(e)}")
        raise ValueError(f"Unable to decode CSV file with supported encodings. Last error: {last_err}")

    def get_sample_catalog(self) -> List[Dict[str, Any]]:
        """Returns catalog of available sample datasets."""
        data_dir = settings.data_dir
        samples_dir = data_dir / "samples"

        catalog = [
            {
                "id": "default",
                "name": "Sample - Superstore (Original)",
                "filename": "Sample - Superstore.csv",
                "description": "Standard Tableau Superstore retail dataset (2014-2017)",
                "path": str(data_dir / "Sample - Superstore.csv"),
                "is_default": True,
            },
            {
                "id": "global_retail",
                "name": "Sample - Global Retail (2022-2024)",
                "filename": "Sample - Global Retail 2023.csv",
                "description": "Multi-category modern enterprise retail dataset with international reach (2022-2024)",
                "path": str(samples_dir / "Sample - Global Retail 2023.csv"),
                "is_default": False,
            },
            {
                "id": "metro_tech",
                "name": "Sample - Metro Electronics & Tech (2023-2025)",
                "filename": "Sample - Metro Electronics 2024.csv",
                "description": "High-ticket hardware, workstations, smart monitors, and peripheral gadgets (2023-2025)",
                "path": str(samples_dir / "Sample - Metro Electronics 2024.csv"),
                "is_default": False,
            },
        ]
        return catalog

    def load_sample(self, sample_id: str) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Loads a specific preset sample dataset by ID."""
        from app.services.preprocessing import DataPreprocessor

        catalog = {s["id"]: s for s in self.get_sample_catalog()}
        if sample_id not in catalog:
            raise ValueError(f"Unknown sample ID: '{sample_id}'. Available: {list(catalog.keys())}")

        item = catalog[sample_id]
        path = Path(item["path"])
        if not path.exists():
            # Fallback in data_dir directly
            alt_path = settings.data_dir / item["filename"]
            if alt_path.exists():
                path = alt_path
            else:
                raise FileNotFoundError(f"Sample file not found at {path}")

        raw = self._read_csv_safe(path)
        cleaned = DataPreprocessor.clean_and_engineer(raw.copy())

        with self._lock:
            self._raw_df = raw
            self._cleaned_df = cleaned
            self._metadata = {
                "source": "sample",
                "sample_id": sample_id,
                "filename": item["filename"],
                "display_name": item["name"],
                "is_default": item["is_default"],
                "row_count": len(cleaned),
                "column_count": len(cleaned.columns),
                "last_loaded": pd.Timestamp.now().isoformat(),
            }
        return self._raw_df, self._cleaned_df

    def load_default(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Loads and preprocesses the default Superstore dataset."""
        return self.load_sample("default")

    def load_custom_csv(self, file_content: bytes, filename: str) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Loads and preprocesses a user-uploaded CSV file."""
        from app.services.preprocessing import DataPreprocessor

        raw = self._read_csv_safe(file_content)
        cleaned = DataPreprocessor.clean_and_engineer(raw.copy())

        with self._lock:
            self._raw_df = raw
            self._cleaned_df = cleaned
            self._metadata = {
                "source": "upload",
                "sample_id": "custom_upload",
                "filename": filename,
                "display_name": filename,
                "is_default": False,
                "row_count": len(cleaned),
                "column_count": len(cleaned.columns),
                "last_loaded": pd.Timestamp.now().isoformat(),
            }
        return self._raw_df, self._cleaned_df

    def get_data(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Returns the current (raw_df, cleaned_df). Loads default if not yet loaded."""
        if self._cleaned_df is None:
            return self.load_default()
        return self._raw_df, self._cleaned_df

    def get_metadata(self) -> dict:
        if self._cleaned_df is None:
            self.load_default()
        return self._metadata.copy()

dataset_manager = DatasetManager()
