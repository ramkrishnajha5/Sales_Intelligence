# 📊 Sales Intelligence — Data Analytics & Machine Learning Dashboard

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Forecasting-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Pytest](https://img.shields.io/badge/Tests-12%20Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)
![Netlify](https://img.shields.io/badge/Frontend-Netlify%20Live-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)

<br/>

### 🌐 Live Production Deployment

[![Live Frontend App](https://img.shields.io/badge/🖥️_Live_Dashboard-Netlify-00C7B7?style=for-the-badge)](https://salesintelligenceggv.netlify.app/)
[![Live FastAPI Backend](https://img.shields.io/badge/⚡_Live_API-Render-46E3B7?style=for-the-badge)](https://sales-intelligence-rflg.onrender.com)
[![Interactive Swagger Docs](https://img.shields.io/badge/📖_Swagger_Docs-FastAPI-009688?style=for-the-badge)](https://sales-intelligence-rflg.onrender.com/docs)

<p align="center">
  <b>An end-to-end full-stack retail intelligence dashboard and machine learning analytics platform.</b><br>
  Built with <b>React 19, TypeScript, Tailwind CSS, Recharts, FastAPI, Pandas, NumPy, and scikit-learn</b>.<br>
  Analyzes multi-year retail transactions to uncover revenue drivers, regional margins, loss leakage, and chronological demand forecasts.
</p>

</div>

---

## 📌 Project Overview

This project delivers a complete enterprise-grade Data Science and Business Intelligence workflow inspired by the [Asthanishad/Sales-Data-Analysis-Dashboard](https://github.com/Asthanishad/Sales-Data-Analysis-Dashboard) reference architecture, completely re-engineered from monolithic Streamlit scripts into an independent, decoupled full-stack application:

* **Frontend:** High-performance React 19 Single Page Application (SPA) in strict TypeScript with Tailwind CSS 4 and Recharts.
* **Backend:** Asynchronous Python FastAPI engine performing vectorized Pandas/NumPy aggregations and SciPy statistical calculations.
* **Machine Learning:** Autoregressive time-series regression forecaster with strict chronological train/test separation (zero data leakage) and RMSE baseline comparison.
* **Multi-Dataset Management:** Seamless 1-click switching between pre-packaged sample datasets, on-demand CSV uploads, and filtered CSV exports.

---

## 🎯 Business Problem & Key Questions

Retail enterprises generate vast volumes of transactional data daily, yet raw sales figures frequently conceal critical operational inefficiencies. High gross revenue does not always translate into net profit.

This analytics system answers essential business questions:
1. **Profit Leakage:** Which product sub-categories generate high sales volume but consistently incur negative net profits?
2. **Discount Sensitivity:** At what promotional discount rate does order profitability collapse?
3. **Geographic Strengths vs. Deficits:** Which regions drive strong margins, and which states represent chronic deficit traps?
4. **Customer Lifetime Dynamics:** What is the distribution of repeat client orders across consumer, corporate, and home office segments?
5. **Demand Trajectory:** How will sales evolve over future quarters based on historical momentum and seasonal patterns?

---

## 🚀 Key Features

### 🛠️ Data Processing & Preprocessing
* **Robust Encodings:** Fallback reading across `utf-8`, `windows-1252`, and `latin1`.
* **Schema Validation:** Strict verification of 21 standard Superstore transaction columns.
* **Feature Engineering:** Automated derivation of `Year`, `Month`, `Month Name`, `YearMonth`, `Quarter`, `Order Processing Days` (shipping latency), and `Row Profit Margin`.
* **Outlier Detection:** Automated parametric bounds calculation via Tukey's IQR Rule ($[Q1 - 1.5 \times \text{IQR}, Q3 + 1.5 \times \text{IQR}]$).
* **Non-Destructive Uploads:** Custom CSV uploads and sample switching update in-memory active sessions without overwriting master disks.

### 📊 Exploratory Data Analysis (EDA) & Business Intelligence
* **6 Core KPIs:** Total Sales, Total Profit, Aggregate Profit Margin, Total Orders, Total Customers, and Average Order Value (AOV).
* **Dynamic Grounded Insights:** Automated business intelligence engine that calculates real-time insights based on current filters.
* **Sales & Profit Progression:** Chronological monthly area and line trends with zero-baseline reference lines.
* **YoY Performance Cards:** Fiscal year comparisons with exact percentage growth rates.
* **Catalog Health & Loss Warnings:** Identifies deficit sub-categories (*Tables*, *Bookcases*) and plots transaction-level discount vs. profit scatter charts.
* **Geographical Rankings:** Top 10 profitable states vs. 10 least profitable deficit watch states.
* **Customer Segment Breakdown:** Consumer, Corporate, and Home Office spend behavior and order frequency buckets.
* **Logistics & Correlation Heatmap:** Pearson correlation coefficients between sales, quantity, discount, profit, and shipping latency.

### 🤖 Machine Learning Time-Series Forecaster
* **Model:** Regularized Ridge Regression ($L_2$ penalty) trained on chronological monthly sales.
* **Feature Engineering:** Autoregressive features (Lag-1, Lag-2), continuous time trend index, and sinusoidal month seasonality ($\sin / \cos$ components).
* **Evaluation:** Out-of-sample Root Mean Squared Error (RMSE) and Mean Absolute Error (MAE) evaluated against a Naive Persistence Baseline.
* **Interactive Horizon:** Configurable 3, 6, and 12-month projections with dynamic train/test ratios.

---

## 📦 Multi-Dataset Testing Support

The system includes **3 pre-packaged retail datasets** for instant testing:

| Dataset Name | Filename | Records | Time Range | Domain & Characteristics |
|---|---|---|---|---|
| **Sample Superstore (Original)** | `Sample - Superstore.csv` | **9,994** | 2014 – 2017 | National retail benchmark across Furniture, Office Supplies, and Tech |
| **Global Retail Enterprise** | `Sample - Global Retail 2023.csv` | **600** | 2022 – 2024 | Modern post-pandemic multi-category retail with international clients |
| **Metro Electronics & Tech** | `Sample - Metro Electronics 2024.csv` | **450** | 2023 – 2025 | Workstation laptops, 4K curved displays, dual monitor arms, and smart desks |

> [!TIP]
> Click the **"Datasets & Samples"** button in the top navigation bar of the live web app to switch between datasets in 1 click or download the raw CSVs!

---

## 📊 Dataset Schema Reference

The core analysis relies on 21 transactional retail attributes:

| Column Header | Data Type | Description |
|---|---|---|
| `Row ID` | Integer | Internal sequential record identifier |
| `Order ID` | String | Unique transaction alphanumeric code (e.g. `CA-2016-152156`) |
| `Order Date` | DateTime | Timestamp when customer placed the transaction |
| `Ship Date` | DateTime | Timestamp when warehouse fulfilled and dispatched the package |
| `Ship Mode` | String | Delivery service level (*Standard Class, Second Class, First Class, Same Day*) |
| `Customer ID` | String | Unique client account identifier (e.g. `CG-12520`) |
| `Customer Name` | String | Client full legal name |
| `Segment` | String | Market demographic (*Consumer, Corporate, Home Office*) |
| `Country` | String | Destination nation (*United States*) |
| `City` | String | Destination municipal city |
| `State` | String | Destination federal state |
| `Postal Code` | String / Int | Postal zip code |
| `Region` | String | Geographic market territory (*West, East, Central, South*) |
| `Product ID` | String | Unique catalog SKU identifier |
| `Category` | String | Primary retail department (*Furniture, Office Supplies, Technology*) |
| `Sub-Category` | String | Granular merchandise grouping (*Chairs, Tables, Phones, Binders, Storage*) |
| `Product Name` | String | Detailed commercial catalog name |
| `Sales` | Float | Gross transaction price paid by customer in USD ($) |
| `Quantity` | Integer | Number of merchandise units purchased |
| `Discount` | Float | Promotional markdown rate percentage ($0.0 - 0.8$) |
| `Profit` | Float | Net operating margin earned on transaction in USD ($) |

---

## 📈 Core Business Formulas

All analytical metrics are computed directly by the Python analytical core:

| Metric | Mathematical Formula | Superstore Baseline | Note |
|---|---|---|---|
| **Total Sales** | $\sum \text{Sales}$ | **$2,297,200.86** | Gross revenue in USD |
| **Total Profit** | $\sum \text{Profit}$ | **$286,397.02** | Net operating profit in USD |
| **Profit Margin** | $\frac{\sum \text{Profit}}{\sum \text{Sales}} \times 100$ | **12.47%** | Strict aggregate ratio (never row average!) |
| **Total Orders** | $\text{count(distinct Order ID)}$ | **5,009** | Distinct transaction orders |
| **Total Customers** | $\text{count(distinct Customer ID)}$ | **793** | Distinct customer accounts |
| **Avg Order Value (AOV)** | $\frac{\text{Total Sales}}{\text{Total Orders}}$ | **$458.61** | Average revenue per distinct basket |

---

## 💡 Key Business Insights Discovered

1. **The 20% Discount Cliff:**
   Transactions with discounts $< 20\%$ yield a healthy average profit margin of **$18.4\%$**. However, transactions discounted at $\ge 20\%$ plunge to an average margin of **$-14.2\%$**, causing massive profit leakage without compensatory volume gains.
2. **Furniture Department Drag:**
   While *Technology* posts a robust **$17.4\%$** profit margin and *Office Supplies* posts **$13.7\%$**, the *Furniture* category achieves only **$2.5\%$** overall due to heavy shipping weight and deep discounting on *Tables* ($-17,725$ total net loss) and *Bookcases* ($-3,472$ loss).
3. **Geographic Deficit Hotspots:**
   Despite ranking among the highest states in gross sales revenue, **Texas** ($-25,729$ deficit), **Ohio** ($-16,971$), and **Pennsylvania** ($-15,559$) suffer large cumulative losses driven by promotional discount structures.
4. **Logistics Utilization:**
   *Standard Class* accommodates **$59.7\%$** of all orders with an average fulfillment transit of **$3.96$ days**, representing the optimal baseline for supply chain carrier contract negotiations.

---

## 📐 Full-Stack Architecture

```
+---------------------------------------------------------------------------------+
|                                 WEB BROWSER                                     |
|             React 19 + TypeScript + Tailwind CSS 4 (Netlify)                    |
|                                                                                 |
|  +--------------------+  +----------------------+  +-------------------------+  |
|  |  AppShell Layout   |  |   Global FilterBar   |  |  Recharts Visualizations|  |
|  |  (Sidebar/Topbar)  |  |  (Multi-Year/Region) |  |  (Area/Bar/Scatter/Donut)|  |
|  +--------------------+  +----------------------+  +-------------------------+  |
|                                     |                                           |
|                           HTTP Fetch / REST JSON                                |
+-------------------------------------|-------------------------------------------+
                                      | (Reverse Proxy / VITE_API_URL)
+-------------------------------------v-------------------------------------------+
|                           FASTAPI PYTHON BACKEND                                |
|                        Render Cloud Web Service                                 |
|                                                                                 |
|  +--------------------+  +----------------------+  +-------------------------+  |
|  |    FastAPI Core    |  |   Analytics Engine   |  |    Machine Learning     |  |
|  |   (Pydantic v2)    |  | (Pandas / NumPy /    |  |  (Ridge Regression TS   |  |
|  |  CORS & Lifespan   |  |  SciPy Statistics)   |  |   Chronological Split)  |  |
|  +--------------------+  +----------------------+  +-------------------------+  |
|                                     |                                           |
|                           In-Memory Thread-Safe                                 |
|                           Dataset Manager Cache                                 |
|                                     |                                           |
|  +----------------------------------v----------------------------------------+  |
|  |       backend/data/Sample - Superstore.csv & Sample Catalogs              |  |
|  |           (9,994 rows, UTF-8 / Windows-1252 Safe Encoding)                |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript (Strict Mode), Vite 8 |
| **Styling & Icons** | Tailwind CSS 4, Lucide React Icons |
| **Data Visualization** | Recharts 3 (AreaChart, LineChart, BarChart, ScatterChart, PieChart) |
| **Backend Framework** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Data Science & ML** | Pandas 3, NumPy 2, SciPy, Statsmodels, scikit-learn |
| **Testing** | Pytest, HTTPX, anyio |
| **Cloud Deployment** | Netlify (Frontend SPA), Render (FastAPI Web Service) |

---

## 🖥️ Application Pages Overview

1. **Executive Overview (`/`):** 6 key KPI cards, dynamic real-time insights, chronological sales and profit trends, category and regional performance, top products, and top customers.
2. **Sales Analysis:** Monthly revenue progression, Year-over-Year (YoY) growth comparison, department contribution, and full chronological ledger.
3. **Product Performance:** Sub-category performance matrix, **loss drag warnings**, top 10 profitable items vs. bottom 10 loss leaders, discount scatter plot, and sortable catalog table.
4. **Regional Analysis:** Territorial contribution cards, top profitable states vs. deficit watch states, and state-by-state ledger.
5. **Customer Insights:** Consumer, Corporate, and Home Office spend breakdown, VIP client rankings, and order repeat frequency buckets.
6. **Logistics & Statistics:** Shipping mode shares, transit latency metrics, discount distribution tiers, Pearson correlation matrix, and summary statistics.
7. **Data Explorer:** Server-side paginated, searchable, and sortable dataset preview, schema verification, CSV file upload, and filtered CSV export.
8. **Data Science Lab:** Preprocessing audit, Tukey's IQR outlier analysis, and scikit-learn time-series Ridge regression forecasting with chronological split.

---

## 🚀 Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/ramkrishnajha5/Sales_Intelligence.git
cd Sales_Intelligence
```

### 2. Windows 1-Click Startup
Double-click the provided batch files:
- `start_backend.bat` (Starts FastAPI at `http://localhost:8000`)
- `start_frontend.bat` (Starts React/Vite at `http://localhost:5173`)

### 3. Manual Terminal Startup
```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🧪 Automated Test Suite

The test suite validates backend preprocessing, KPI math, profit margin integrity, API endpoints, and machine learning components:

```bash
cd backend
python -m pytest tests -v
```

### Execution Results:
```text
tests/test_analytics.py::test_kpi_calculations_and_profit_margin PASSED  [  8%]
tests/test_analytics.py::test_filtering_logic PASSED                     [ 16%]
tests/test_analytics.py::test_empty_filter_results PASSED                [ 25%]
tests/test_api.py::test_dashboard_summary_api[asyncio] PASSED            [ 33%]
tests/test_api.py::test_sales_and_products_api[asyncio] PASSED           [ 41%]
tests/test_api.py::test_data_preview_and_export[asyncio] PASSED          [ 50%]
tests/test_api.py::test_ml_forecasting_api[asyncio] PASSED               [ 58%]
tests/test_api.py::test_invalid_upload_handling[asyncio] PASSED          [ 66%]
tests/test_health.py::test_health_check[asyncio] PASSED                  [ 75%]
tests/test_preprocessing.py::test_dataset_loading_and_columns PASSED     [ 83%]
tests/test_preprocessing.py::test_missing_column_validation PASSED       [ 91%]
tests/test_preprocessing.py::test_quality_report PASSED                  [100%]

============================= 12 passed in 3.57s =============================
```

---

## 📄 Independent Jupyter Notebook

The repository includes a comprehensive 12-section Jupyter Notebook demonstrating the Python data science methodology:
- 📓 **[notebooks/Sales_Data_Analysis.ipynb](./notebooks/Sales_Data_Analysis.ipynb)**

Covers:
1. Business problem formulation
2. Data quality inspection & duplicate checks
3. Preprocessing & feature engineering
4. Statistical hypotheses & correlation tests
5. Exploratory visualizations using Matplotlib & Seaborn
6. Machine learning time-series regression with chronological split
7. Executive data-driven recommendations

---

## 👥 Author & Attribution

* **Author:** Ramkrishna Jha
* **GitHub:** [@ramkrishnajha5](https://github.com/ramkrishnajha5)
* **Repository:** [ramkrishnajha5/Sales_Intelligence](https://github.com/ramkrishnajha5/Sales_Intelligence)
* **Reference Attribution:** Inspired by [Asthanishad/Sales-Data-Analysis-Dashboard](https://github.com/Asthanishad/Sales-Data-Analysis-Dashboard) and the Tableau Sample Superstore benchmark.
