import React from 'react';
import { FilterX, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'No transaction records match the current filter selection. Try broadening your criteria or resetting filters.',
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <FilterX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mt-1.5 mb-6">{description}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );
};
