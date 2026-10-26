# 📊 Sales Intelligence — Enterprise Data Analytics Dashboard

<div align="center">

![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Pytest](https://img.shields.io/badge/Tests-12%20Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)
![Netlify](https://img.shields.io/badge/Deploy-Netlify%20Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

<p align="center">
  <b>A modern, full-stack retail analytics intelligence system and machine learning forecasting platform.</b><br>
  Built with React 19, TypeScript, Tailwind CSS, Recharts, FastAPI, Pandas, NumPy, and scikit-learn.
</p>

[🚀 Live Local Demo](#-quick-start-in-60-seconds) • [📦 Sample Datasets](#-multiple-test-sample-datasets) • [🌐 Host on Netlify](#-how-to-host-on-netlify-for-free) • [🐙 Upload to GitHub](#-how-to-upload-to-github) • [🎓 Presentation Guide](#-teacher-presentation-guide)

</div>

---

## 📑 Interactive Table of Contents

<details open>
<summary><b>Click to expand / collapse navigation</b></summary>

1. [🌟 System Highlights & Key Features](#-system-highlights--key-features)
2. [📦 Multiple Test Sample Datasets](#-multiple-test-sample-datasets)
3. [⚡ Quick Start in 60 Seconds](#-quick-start-in-60-seconds)
4. [📐 Architecture & Math Integrity](#-architecture--math-integrity)
5. [🖥️ Interactive Dashboard Tour (8 Pages)](#️-interactive-dashboard-tour-8-pages)
6. [🐙 How to Upload to GitHub](#-how-to-upload-to-github)
7. [🌐 How to Host on Netlify for Free](#-how-to-host-on-netlify-for-free)
8. [🧪 Automated Test Suite](#-automated-test-suite)
9. [🎓 Teacher Presentation Guide](#-teacher-presentation-guide)
10. [🔗 Reference & Attribution](#-reference--attribution)

</details>

---

## 🌟 System Highlights & Key Features

- **Decoupled Full-Stack Architecture:** Pure React 19 + TypeScript SPA for UI; Python FastAPI for high-speed vectorized data operations, statistics, and machine learning.
- **Strict Mathematical Integrity:** 
  $$\text{Overall Profit Margin} = \frac{\sum \text{Profit}}{\sum \text{Sales}} \times 100 = 12.47\%$$
  *(Never averages row-level percentage margins).*
- **Multi-Dataset Management:** Seamless 1-click switching between pre-packaged sample datasets, on-demand CSV uploads, and filtered CSV exports.
- **Empirical Loss Warnings:** Identifies deficit sub-categories (e.g. *Tables* and *Bookcases*) and discount thresholds ($>20\%$) where margins collapse.
- **Syllabus Machine Learning Lab:** Rigorous time-series sales forecasting using scikit-learn Ridge regression with chronological train/test separation (zero data leakage) and RMSE baseline comparison.

---

## 📦 Multiple Test Sample Datasets

We provide **3 distinct, pre-packaged retail datasets** ready for instant testing and analysis:

| Dataset Name | Filename | Records | Time Span | Key Characteristics |
|---|---|---|---|---|
| **Original Superstore** | `Sample - Superstore.csv` | **9,994** | 2014 – 2017 | Classic national retail benchmark covering 4 US regions |
| **Global Retail** | `Sample - Global Retail 2023.csv` | **600** | 2022 – 2024 | Modern post-pandemic multi-category retail with international clients |
| **Metro Tech & Hardware** | `Sample - Metro Electronics 2024.csv` | **450** | 2023 – 2025 | High-ticket workstation laptops, 4K curved monitors, and smart desk gear |

<details>
<summary><b>💡 How to switch or upload datasets in the web dashboard</b></summary>

1. Open [http://localhost:5173](http://localhost:5173).
2. Click the **"Datasets & Samples"** button with the sparkle icon in the top header.
3. Choose any sample dataset and click **"Load Dataset"** to switch instantly.
4. Click the **Download** icon next to any sample to save the raw CSV to your computer.
5. Drag and drop any custom retail CSV file into the upload zone to test your own data!

</details>

---

## ⚡ Quick Start in 60 Seconds

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** installed

### Windows One-Click Launch
```cmd
:: 1. Start the Python Backend (Port 8000)
start_backend.bat

:: 2. Start the React Frontend (Port 5173)
start_frontend.bat
```

### Manual Command Line Launch
<details>
<summary><b>Click to view terminal commands</b></summary>

#### Terminal 1 — Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 — Frontend Application
```bash
cd frontend
npm install
npm run dev
```

#### Local URLs
- 🖥️ **Web Dashboard:** [http://localhost:5173](http://localhost:5173)
- 📖 **Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **System Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

</details>

---

## 📐 Architecture & Math Integrity

```
+---------------------------------------------------------------------------------+
|                                 CLIENT (BROWSER)                                |
|                   React 19 + TypeScript Strict Mode + Vite                      |
|                                                                                 |
|  +--------------------+  +----------------------+  +-------------------------+  |
|  |  AppShell Layout   |  |   FilterBar Context  |  |  Recharts Visualizations|  |
|  |  (Sidebar/Topbar)  |  |  (Multi-Year/Region) |  |  (Area/Bar/Scatter/Donut)|  |
|  +--------------------+  +----------------------+  +-------------------------+  |
|                                     |                                           |
|                           HTTP Fetch / REST JSON                                |
+-------------------------------------|-------------------------------------------+
                                      | (Vite Proxy: /api -> :8000)
+-------------------------------------v-------------------------------------------+
|                           FASTAPI PYTHON BACKEND                                |
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
|  |              Active Dataset: Sample - Superstore.csv                      |  |
|  |          (Auto-fallback to Sample 2 or Sample 3 on demand)                |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

### Core Business Formulas
- **Total Sales:** $\sum \text{Sales}$
- **Total Profit:** $\sum \text{Profit}$
- **Profit Margin:** $\frac{\sum \text{Profit}}{\sum \text{Sales}} \times 100$
- **Total Orders:** $\text{count(distinct Order ID)}$
- **Total Customers:** $\text{count(distinct Customer ID)}$
- **Average Order Value (AOV):** $\frac{\text{Total Sales}}{\text{Total Orders}}$

---

## 🖥️ Interactive Dashboard Tour (8 Pages)

<details open>
<summary><b>1. Executive Overview</b></summary>

- 6 core KPI cards with status badges
- Dynamic insights banner generated directly from active data
- Chronological monthly sales and profit trends
- Category and regional sales & profit contributions
- Top 10 profitable products and customer rankings

</details>

<details>
<summary><b>2. Sales Performance & Growth</b></summary>

- Full chronological monthly sales progression
- Year-over-Year (YoY) performance breakdown cards with growth percentages
- Category and regional comparisons
- Detailed monthly performance ledger table

</details>

<details>
<summary><b>3. Product Performance & Catalog Operations</b></summary>

- Department-level revenue and profit breakdown
- Interactive **Discount vs. Profitability scatter plot**
- Sub-category matrix with explicit **loss warnings** for deficit items (e.g., Tables, Bookcases)
- Top 10 profitable vs. 10 least profitable products (loss leaders)
- Sortable product catalog table with margin percentages

</details>

<details>
<summary><b>4. Regional & Geographic Analysis</b></summary>

- Regional overview cards (West, East, Central, South)
- Top 10 profitable states vs. deficit watch states (e.g. Texas, Ohio)
- State-by-state operational performance table

</details>

<details>
<summary><b>5. Customer Insights & Value</b></summary>

- Customer segmentation (Consumer, Corporate, Home Office)
- Top customers by spend and top customers by net profit
- Order frequency distribution buckets (1, 2–3, 4–5, 6+ orders)

</details>

<details>
<summary><b>6. Logistics, Shipping & Statistical Analysis</b></summary>

- Shipping mode breakdown (Standard Class, Second Class, First Class, Same Day)
- Average transit duration (mean: 3.96 days)
- Discount bracket distribution
- Pearson numerical feature correlation matrix
- Parametric and non-parametric descriptive statistics table

</details>

<details>
<summary><b>7. Data Explorer & Quality Audit</b></summary>

- Server-side paginated, searchable, and sortable dataset preview
- Schema validation reporting (21 columns, data types, missing value audit)
- CSV upload with validation
- Filtered CSV download

</details>

<details>
<summary><b>8. Data Science & Machine Learning Forecasting</b></summary>

- **Preprocessing audit:** Raw vs. cleaned rows, date conversion verification, engineered features
- **Statistical Outlier Detection:** Tukey's IQR Method ($[Q1 - 1.5 \times \text{IQR}, Q3 + 1.5 \times \text{IQR}]$)
- **Time-Series Regression Model:** Ridge regression with chronological train/test split, autoregressive lags (Lag-1, Lag-2), trend index, and month seasonality
- **Out-of-sample evaluation:** RMSE comparison vs. Naive Baseline
- **Interactive forecast:** Configurable horizon (3–12 months) and train ratio (70%–85%)

</details>

---

## 🐙 How to Upload to GitHub

Follow these steps to upload this complete repository to your GitHub account:

### Method 1: Using the Command Line (Recommended)

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Enter a repository name (e.g., `sales-data-analysis-dashboard`).
   - Keep it **Public** (or Private).
   - **Do NOT** initialize with a README, .gitignore, or license (we already created them).
   - Click **Create repository**.

2. **Run these commands in your project folder:**
   ```bash
   # Open terminal in the project directory:
   cd c:\Users\ram03\Sales_Data_Analyzer

   # Initialize git repository
   git init

   # Add all files to staging
   git add .

   # Commit the files
   git commit -m "feat: complete full-stack sales data analysis dashboard"

   # Rename branch to main
   git branch -M main

   # Link your local repo to GitHub (replace USERNAME and REPO_NAME with yours)
   git remote add origin https://github.com/USERNAME/REPO_NAME.git

   # Push your code to GitHub
   git push -u origin main
   ```

### Method 2: Using GitHub Desktop
1. Download and install [GitHub Desktop](https://desktop.github.com).
2. Click **File > Add Local Repository...** and select `c:\Users\ram03\Sales_Data_Analyzer`.
3. If prompted to initialize a repository, click **Create a repository**.
4. Type a commit summary (e.g., `"Initial full-stack release"`) and click **Commit to main**.
5. Click **Publish repository** to push it to your GitHub profile.

---

## 🌐 How to Host on Netlify for Free

Because this is a full-stack application (React Frontend + Python Backend), modern cloud deployment uses a free, decoupled setup:

- **Frontend (React + Vite):** Hosted on **Netlify** (100% Free).
- **Backend (FastAPI + Python):** Hosted on **Render.com** (100% Free tier).

---

### Step 1: Deploy Backend on Render (Free)

1. Sign up for a free account at [render.com](https://render.com).
2. Click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name:** `sales-intelligence-api`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **Create Web Service**. Render will give you a public URL (e.g., `https://sales-intelligence-api.onrender.com`).
6. Verify it works by opening `https://sales-intelligence-api.onrender.com/docs`.

---

### Step 2: Deploy Frontend on Netlify (Free)

We have already included a pre-configured [netlify.toml](file:///c:/Users/ram03/Sales_Data_Analyzer/netlify.toml) file in the project!

1. Sign up for a free account at [netlify.com](https://netlify.com).
2. Click **Add new site > Import an existing project > Deploy with GitHub**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **Add Environment Variable:**
   - Under **Site configuration > Environment variables**, click **Add a variable**.
   - **Key:** `VITE_API_URL`
   - **Value:** `https://sales-intelligence-api.onrender.com` *(your Render backend URL)*
6. Click **Deploy Site**!
7. Within 60 seconds, your site will be live at a custom URL (e.g., `https://sales-intelligence-dashboard.netlify.app`).

<details>
<summary><b>💡 Alternative: Drag-and-Drop Deploy on Netlify (No Git required)</b></summary>

1. In your local terminal, build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `frontend/dist` folder into the browser window.
4. Your frontend is live in 10 seconds!

</details>

---

## 🧪 Automated Test Suite

We implemented an automated test suite verifying data preprocessing, math calculations, API endpoints, and machine learning components.

Run the test suite:
```bash
cd backend
python -m pytest tests -v
```

### Test Execution Output
```
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

## 🎓 Teacher Presentation Guide

<details open>
<summary><b>Click to view 5-minute presentation script</b></summary>

1. **Introduction & Separation of Concerns (1 min):**
   - *"We built an enterprise full-stack web application using React 19, TypeScript, and FastAPI, departing from monolithic Streamlit prototypes."*
   - Show the 6 KPI cards on the **Overview** page and explain the math integrity ($\frac{\sum \text{Profit}}{\sum \text{Sales}} \times 100$).

2. **Interactive Filtering & Dynamic Insights (1 min):**
   - Click the **2016** year pill on the filter bar.
   - Point out that the frontend is not hardcoded: all metrics are computed dynamically in Python via vectorized Pandas aggregations.

3. **Multiple Datasets & Live Switching (1 min):**
   - Click **Datasets & Samples** in the header.
   - Switch to **Sample - Global Retail (2022-2024)** or **Sample - Metro Electronics (2023-2025)** to show how the system seamlessly handles different retail domains and date ranges.

4. **Product Intelligence & Loss Warnings (1 min):**
   - Navigate to **Product Performance**. Show the red loss warnings for **Tables** and **Bookcases**.
   - Show the **Discount vs. Profitability Scatter Plot** demonstrating that discounts $>20\%$ cause severe profit leakage.

5. **Data Science Lab & Machine Learning (1 min):**
   - Navigate to **Data Science & ML**. Show the **Tukey IQR Outlier Table** and the **Ridge Regression Time-Series Sales Forecast**.
   - Explain the importance of a **chronological train/test split** to eliminate future data leakage.

</details>

---

## 🔗 Reference & Attribution

- **Reference Repository:** [Asthanishad/Sales-Data-Analysis-Dashboard](https://github.com/Asthanishad/Sales-Data-Analysis-Dashboard)
- **Base Dataset:** Tableau Sample Superstore Dataset (`Sample - Superstore.csv`)
- **Full-Stack Re-architecture:** Independently implemented in React 19, TypeScript, Tailwind CSS, FastAPI, and scikit-learn.
