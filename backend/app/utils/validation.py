from fastapi import HTTPException, UploadFile
from app.config import settings

def validate_upload_file(file: UploadFile) -> None:
    """Validates the uploaded file is a valid CSV within size constraints."""
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only CSV files (.csv) are accepted."
        )

    # Check file size if header provided
    if file.size and file.size > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum size limit of {settings.max_upload_size_bytes // (1024 * 1024)}MB."
        )
