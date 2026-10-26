import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.schemas import FilterOptions
from app.dependencies import get_active_data
from app.services.analytics import AnalyticsService
from app.services.data_loader import dataset_manager

from app.api.routes import health, dashboard, sales, products, regions, customers, logistics, dataset, data_science

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sales_intelligence")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Preload default dataset into memory
    try:
        dataset_manager.load_default()
        meta = dataset_manager.get_metadata()
        logger.info(f"Successfully loaded default dataset: {meta['filename']} ({meta['row_count']} rows)")
    except Exception as e:
        logger.warning(f"Could not load default dataset on startup: {e}")
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Enterprise-grade REST API for Sales Data Analysis and Machine Learning Forecasting.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root level routes & aliases
@app.get("/", tags=["System"])
def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }

@app.get("/api/filters", response_model=FilterOptions, tags=["Dashboard"])
def get_global_filters(data=Depends(get_active_data)):
    _, cleaned_df = data
    return AnalyticsService.get_filter_options(cleaned_df)

# Include Route Modules
app.include_router(health.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(sales.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(regions.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(logistics.router, prefix="/api")
app.include_router(dataset.router, prefix="/api")
app.include_router(data_science.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
