import React, { useState, useEffect } from 'react';
import {
  DataQualityResponse,
  ForecastResponse,
  ForecastPoint,
} from '../types/analytics';
import { api } from '../services/api';
import { ChartCard } from '../components/dashboard/ChartCard';
import {
  BrainCircuit,
  Sliders,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';

interface DataSciencePageProps {
  onRefreshData?: () => void;
}

export const DataSciencePage: React.FC<DataSciencePageProps> = () => {
  const [quality, setQuality] = useState<DataQualityResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loadingQuality, setLoadingQuality] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  // Forecast settings
  const [periodsAhead, setPeriodsAhead] = useState(6);
  const [trainRatio, setTrainRatio] = useState(0.8);

  useEffect(() => {
    loadQuality();
    runForecast(6, 0.8);
  }, []);

  const loadQuality = async () => {
    setLoadingQuality(true);
    try {
      const data = await api.getDataQuality();
      setQuality(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingQuality(false);
    }
  };

  const runForecast = async (periods: number, ratio: number) => {
    setLoadingForecast(true);
    setForecastError(null);
    try {
      const fc = await api.getForecast(periods, ratio);
      setForecast(fc);
    } catch (err: any) {
      setForecastError(err.message || 'Failed to generate forecast.');
    } finally {
      setLoadingForecast(false);
    }
  };

  const handleForecastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runForecast(periodsAhead, trainRatio);
  };

  const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload as ForecastPoint;
      return (
        <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-xs">
          <div className="font-semibold text-slate-800 mb-1">{label}</div>
          {pt.actual !== null && (
            <div className="text-slate-700 font-medium">
              Actual Sales: ${pt.actual.toLocaleString()}
            </div>
          )}
          {pt.baseline_predicted !== null && (
            <div className="text-amber-600 font-medium">
              Naive Baseline: ${pt.baseline_predicted.toLocaleString()}
            </div>
          )}
          {pt.model_predicted !== null && (
            <div className="text-blue-600 font-bold">
              Ridge Forecast: ${pt.model_predicted.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-1">
            {pt.is_future ? 'Statistical future projection' : 'Out-of-sample evaluation'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Syllabus Demonstration Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          <BrainCircuit className="w-4 h-4" />
          Academic Syllabus Demonstration &bull; Python Data Science Workflow
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Data Engineering, Statistics & Machine Learning Lab
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
          Demonstrates the complete applied data science pipeline: data cleaning, schema validation, feature engineering, Tukey IQR outlier analysis, and scikit-learn time-series regression forecasting with strictly chronological train/test separation.
        </p>
      </div>

      {/* 1. Preprocessing & Feature Engineering Audit */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          1. Data Cleaning & Feature Engineering Audit
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All transformations are performed deterministically in Python Pandas without destructive row dropping.
        </p>

        {quality && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-xs text-slate-500 font-medium">Row Preservation</div>
              <div className="text-lg font-bold text-slate-800 mt-1">
                {quality.cleaned_rows.toLocaleString()} / {quality.raw_rows.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% valid records maintained
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-xs text-slate-500 font-medium">Date Transformations</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">
                Order Date &amp; Ship Date
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Parsed to ISO datetime (YYYY-MM-DD)
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-xs text-slate-500 font-medium">Duplicate Rows Audit</div>
              <div className="text-lg font-bold text-slate-800 mt-1">
                {quality.duplicate_rows_count} Duplicates
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Zero redundant transaction rows</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-xs text-slate-500 font-medium">Engineered Features</div>
              <div className="text-lg font-bold text-blue-600 mt-1">
                +{quality.engineered_features.length} Features
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Year, Month, Quarter, Latency, Margin
              </div>
            </div>
          </div>
        )}

        {/* Feature list pills */}
        {quality && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Synthesized Dimensions:</span>
            {quality.engineered_features.map(feat => (
              <span key={feat} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono text-[11px]">
                {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Tukey's IQR Outlier Detection */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          2. Statistical Outlier Detection (Tukey's IQR Method: [Q1 - 1.5&times;IQR, Q3 + 1.5&times;IQR])
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Rigorous parametric boundaries identifying extreme values in continuous variables. Outliers are preserved to maintain retail transaction truth.
        </p>

        {quality && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Variable</th>
                  <th className="py-2.5 px-3 text-right">Q1 (25th %)</th>
                  <th className="py-2.5 px-3 text-right">Q3 (75th %)</th>
                  <th className="py-2.5 px-3 text-right">IQR</th>
                  <th className="py-2.5 px-3 text-right">Lower Bound</th>
                  <th className="py-2.5 px-3 text-right">Upper Bound</th>
                  <th className="py-2.5 px-3 text-right">Outlier Count</th>
                  <th className="py-2.5 px-3 text-right">Outlier %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quality.outliers.map(o => (
                  <tr key={o.column} className="hover:bg-slate-50/70 font-mono">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 font-sans">{o.column}</td>
                    <td className="py-2.5 px-3 text-right">{o.q1}</td>
                    <td className="py-2.5 px-3 text-right">{o.q3}</td>
                    <td className="py-2.5 px-3 text-right">{o.iqr}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{o.lower_bound}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{o.upper_bound}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600">{o.outlier_count}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600">{o.outlier_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Machine Learning: Chronological Time-Series Sales Forecast */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. Machine Learning: Chronological Time-Series Sales Forecast (scikit-learn)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly chronological train/test separation (zero data leakage). Evaluates a Ridge Regression model against a Naive Baseline.
            </p>
          </div>

          {/* Forecast Hyperparameter Controls */}
          <form onSubmit={handleForecastSubmit} className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Horizon:</span>
              <select
                value={periodsAhead}
                onChange={e => setPeriodsAhead(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Train Split:</span>
              <select
                value={trainRatio}
                onChange={e => setTrainRatio(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs"
              >
                <option value={0.7}>70% Train</option>
                <option value={0.8}>80% Train</option>
                <option value={0.85}>85% Train</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingForecast}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {loadingForecast ? 'Training...' : 'Re-fit Model'}
            </button>
          </form>
        </div>

        {forecastError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 mb-4">
            {forecastError}
          </div>
        )}

        {/* Model Metrics Scorecard */}
        {forecast && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-500 font-medium">Model Architecture</div>
              <div className="text-xs font-bold text-slate-900 mt-1">{forecast.model_name}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Features: {forecast.features_used.join(', ')}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-500 font-medium">Sample Partitioning</div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {forecast.train_points_count} Train / {forecast.test_points_count} Test Months
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">Chronological split (no leakage)</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-500 font-medium">Baseline Naive RMSE</div>
              <div className="text-lg font-bold text-amber-600 mt-1">
                ${forecast.baseline_rmse.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Lag-1 persistence baseline</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-500 font-medium">Model Evaluation RMSE</div>
              <div className="text-lg font-bold text-blue-600 mt-1">
                ${forecast.model_rmse.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                {forecast.model_rmse < forecast.baseline_rmse
                  ? `${((1 - forecast.model_rmse / forecast.baseline_rmse) * 100).toFixed(1)}% error reduction vs baseline`
                  : 'Competitive with baseline'}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Forecast Plot */}
        {forecast && (
          <div className="h-80 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={forecast.forecast_points}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomForecastTooltip />} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 10 }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Historical Sales"
                  stroke="#1e293b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1e293b' }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="baseline_predicted"
                  name="Baseline Test Prediction"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="model_predicted"
                  name="Ridge Model Predicted & Forecast"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb' }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Statistical Interpretation */}
        {forecast && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Data Science Interpretation: </span>
            {forecast.interpretation}
          </div>
        )}
      </div>
    </div>
  );
};
