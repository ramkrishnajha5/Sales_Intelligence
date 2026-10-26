from fastapi import APIRouter, Depends, Query, UploadFile, File, Response, HTTPException
from typing import Optional
import io
import numpy as np
import pandas as pd
from app.schemas import FilterParams, DataPreviewResponse, DataQualityResponse
from app.dependencies import get_filter_params, get_active_data
from app.services.analytics import AnalyticsService
from app.services.preprocessing import DataPreprocessor
from app.services.data_loader import dataset_manager
from app.utils.validation import validate_upload_file

router = APIRouter(prefix="/data", tags=["Dataset Operations"])

@router.get("/preview", response_model=DataPreviewResponse)
def get_data_preview(
    params: FilterParams = Depends(get_filter_params),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: Optional[str] = Query(None, description="Column name to sort by"),
    sort_order: Optional[str] = Query("desc", description="Sort order: 'asc' or 'desc'"),
    search: Optional[str] = Query(None, description="Global text search keyword"),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    if search:
        search_lower = search.lower().strip()
        mask = pd.Series(False, index=filtered_df.index)
        search_cols = ["Order ID", "Customer Name", "Product Name", "City", "State", "Category", "Sub-Category"]
        for c in search_cols:
            if c in filtered_df.columns:
                mask |= filtered_df[c].astype(str).str.lower().str.contains(search_lower, na=False)
        filtered_df = filtered_df[mask]

    if sort_by and sort_by in filtered_df.columns:
        ascending = sort_order.lower() == "asc"
        filtered_df = filtered_df.sort_values(sort_by, ascending=ascending)

    total_rows = len(filtered_df)
    total_pages = max(1, (total_rows + page_size - 1) // page_size)

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    sliced = filtered_df.iloc[start_idx:end_idx].copy()

    # Format datetime columns for clean JSON representation
    if "Order Date" in sliced.columns:
        sliced["Order Date"] = sliced["Order Date"].dt.strftime("%Y-%m-%d")
    if "Ship Date" in sliced.columns:
        sliced["Ship Date"] = sliced["Ship Date"].dt.strftime("%Y-%m-%d")

    records = sliced.to_dict(orient="records")

    # Replace any non-finite numbers (NaN, inf) with None/0 for valid JSON
    clean_records = []
    for r in records:
        clean_r = {}
        for k, v in r.items():
            if pd.isna(v) or v is np.nan:
                clean_r[k] = None
            else:
                clean_r[k] = v
        clean_records.append(clean_r)

    return DataPreviewResponse(
        total_rows=total_rows,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        rows=clean_records,
    )

@router.get("/quality", response_model=DataQualityResponse)
def get_data_quality(data=Depends(get_active_data)):
    raw_df, cleaned_df = data
    return DataPreprocessor.get_quality_report(raw_df, cleaned_df)

@router.get("/export")
def export_filtered_csv(
    params: FilterParams = Depends(get_filter_params),
    data=Depends(get_active_data)
):
    _, cleaned_df = data
    filtered_df = AnalyticsService.filter_dataframe(cleaned_df, params)

    export_df = filtered_df.copy()
    if "Order Date" in export_df.columns:
        export_df["Order Date"] = export_df["Order Date"].dt.strftime("%Y-%m-%d")
    if "Ship Date" in export_df.columns:
        export_df["Ship Date"] = export_df["Ship Date"].dt.strftime("%Y-%m-%d")

    output = io.StringIO()
    export_df.to_csv(output, index=False)
    csv_bytes = output.getvalue().encode("utf-8")

    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=filtered_sales_data.csv"}
    )

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    validate_upload_file(file)
    content = await file.read()

    try:
        raw_df, cleaned_df = dataset_manager.load_custom_csv(content, file.filename)
        return {
            "status": "success",
            "message": f"Successfully uploaded and preprocessed '{file.filename}'.",
            "rows_loaded": len(cleaned_df),
            "columns": len(cleaned_df.columns),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reset")
def reset_to_default():
    dataset_manager.load_default()
    meta = dataset_manager.get_metadata()
    return {
        "status": "success",
        "message": "Reset to original Superstore dataset.",
        "metadata": meta,
    }

@router.get("/samples")
def get_sample_list():
    """Returns list of available pre-packaged sample datasets."""
    return dataset_manager.get_sample_catalog()

@router.post("/load-sample/{sample_id}")
def load_sample_dataset(sample_id: str):
    """Loads a specific pre-packaged sample dataset."""
    try:
        raw_df, cleaned_df = dataset_manager.load_sample(sample_id)
        meta = dataset_manager.get_metadata()
        return {
            "status": "success",
            "message": f"Successfully activated dataset: {meta.get('display_name')}",
            "metadata": meta,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/download-sample/{sample_id}")
def download_sample_csv(sample_id: str):
    """Downloads a raw sample dataset CSV file."""
    catalog = {s["id"]: s for s in dataset_manager.get_sample_catalog()}
    if sample_id not in catalog:
        raise HTTPException(status_code=404, detail="Sample dataset not found.")

    item = catalog[sample_id]
    import os
    path = item["path"]
    if not os.path.exists(path):
        # Fallback to backend/data
        alt = os.path.join("backend", "data", item["filename"])
        if os.path.exists(alt):
            path = alt
        else:
            raise HTTPException(status_code=404, detail="Sample file not found on disk.")

    with open(path, "rb") as f:
        content = f.read()

    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=\"{item['filename']}\""}
    )

