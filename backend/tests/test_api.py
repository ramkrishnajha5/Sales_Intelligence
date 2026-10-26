import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

@pytest.mark.anyio
async def test_dashboard_summary_api():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/dashboard/summary")
        assert res.status_code == 200
        data = res.json()
        assert "kpis" in data
        assert data["kpis"]["total_sales"] > 0
        assert "monthly_trends" in data
        assert len(data["monthly_trends"]) > 0
        assert "category_breakdown" in data
        assert "insights" in data

@pytest.mark.anyio
async def test_sales_and_products_api():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res_sales = await client.get("/api/sales/analysis")
        assert res_sales.status_code == 200

        res_prod = await client.get("/api/products/analysis")
        assert res_prod.status_code == 200
        prod_data = res_prod.json()
        assert len(prod_data["top_products_sales"]) > 0
        assert len(prod_data["least_profitable_products"]) > 0

@pytest.mark.anyio
async def test_data_preview_and_export():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res_prev = await client.get("/api/data/preview?page=1&page_size=10")
        assert res_prev.status_code == 200
        prev_data = res_prev.json()
        assert len(prev_data["rows"]) == 10
        assert prev_data["total_rows"] > 0

        res_exp = await client.get("/api/data/export")
        assert res_exp.status_code == 200
        assert res_exp.headers["content-type"].startswith("text/csv")
        assert len(res_exp.content) > 1000

@pytest.mark.anyio
async def test_ml_forecasting_api():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res_fc = await client.post("/api/data-science/forecast", json={"periods_ahead": 6, "train_ratio": 0.8})
        assert res_fc.status_code == 200
        fc_data = res_fc.json()
        assert fc_data["model_name"] != ""
        assert fc_data["model_rmse"] > 0
        assert len(fc_data["forecast_points"]) > 0

@pytest.mark.anyio
async def test_invalid_upload_handling():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Invalid file extension
        files = {"file": ("test.txt", b"some text content", "text/plain")}
        res = await client.post("/api/data/upload", files=files)
        assert res.status_code == 400
