import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    app_name: str = "Sales Intelligence — Data Analytics API"
    app_version: str = "1.0.0"
    base_dir: Path = BASE_DIR
    data_dir: Path = BASE_DIR / "data"
    default_dataset_path: Path = BASE_DIR / "data" / "Sample - Superstore.csv"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    max_upload_size_bytes: int = 50 * 1024 * 1024  # 50 MB

settings = Settings()
