import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Calculating analytics and aggregating records...',
}) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 h-28">
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-2 bg-slate-100 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Chart Cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 h-80 flex flex-col justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-48 bg-slate-100 rounded"></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 h-80 flex flex-col justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-48 bg-slate-100 rounded"></div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2">{message}</div>
    </div>
  );
};
