import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Database,
  CheckCircle2,
  Download,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { SampleDataset, DatasetMetadata } from '../../types/analytics';

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: DatasetMetadata | null;
  onDatasetChanged: () => void;
}

export const DatasetModal: React.FC<DatasetModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onDatasetChanged,
}) => {
  const [samples, setSamples] = useState<SampleDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSamples();
      setStatusMessage(null);
    }
  }, [isOpen]);

  const loadSamples = async () => {
    try {
      const list = await api.getSamples();
      setSamples(list);
    } catch (err: any) {
      console.error('Failed to load sample catalog:', err);
    }
  };

  if (!isOpen) return null;

  const handleSelectSample = async (sampleId: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.loadSample(sampleId);
      setStatusMessage({ text: res.message });
      onDatasetChanged();
    } catch (err: any) {
      setStatusMessage({ text: `Failed: ${err.message}`, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage({ text: `Uploading and validating ${file.name}...` });
    try {
      const res = await api.uploadDataset(file);
      setStatusMessage({ text: res.message });
      onDatasetChanged();
    } catch (err: any) {
      setStatusMessage({ text: `Upload failed: ${err.message}`, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dataset Management &amp; Sample Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Switch between curated test datasets or upload your own CSV file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`my-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Active Dataset Status Strip */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                Active: {metadata?.display_name || metadata?.filename || 'Sample - Superstore.csv'}
              </div>
              <div className="text-[11px] text-slate-500">
                {metadata?.row_count.toLocaleString()} rows &bull; {metadata?.column_count} columns
              </div>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">
            Active Dataset
          </span>
        </div>

        {/* Section 1: Pre-Packaged Sample Datasets */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Pre-Packaged Test Sample Datasets
          </div>

          <div className="space-y-2.5">
            {samples.map(sample => {
              const isCurrent =
                metadata?.filename === sample.filename || metadata?.sample_id === sample.id;
              return (
                <div
                  key={sample.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {sample.name}
                      </h4>
                      {sample.is_default && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          Original
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sample.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={api.getDownloadSampleUrl(sample.id)}
                      download={sample.filename}
                      className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Download sample CSV file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleSelectSample(sample.id)}
                      disabled={loading || isCurrent}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white opacity-90 cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isCurrent ? 'Active' : 'Load Dataset'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Upload Custom CSV */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            Upload Custom Retail CSV
          </div>

          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer block">
            <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
            <span className="text-xs font-semibold text-slate-800">
              Click to select or drag and drop a CSV file
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Must contain standard Superstore columns (Sales, Profit, Order Date, Category, etc.)
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Non-destructive: original dataset is always preserved.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
