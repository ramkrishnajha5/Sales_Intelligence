from fastapi import APIRouter
from app.config import settings
from app.services.data_loader import dataset_manager

router = APIRouter()

@router.get("/health", tags=["System"])
def health_check():
    """Health check endpoint to verify backend operational status."""
    meta = dataset_manager.get_metadata()
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "dataset_loaded": meta["filename"],
        "records": meta["row_count"],
    }

@router.get("/metadata", tags=["System"])
def get_metadata():
    """Returns metadata about the active dataset."""
    return dataset_manager.get_metadata()
