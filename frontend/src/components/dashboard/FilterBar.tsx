import React from 'react';
import { Filter, X, Calendar, MapPin, Tag, Truck, Users } from 'lucide-react';
import { FilterParams, FilterOptions } from '../../types/analytics';

interface FilterBarProps {
  options: FilterOptions | null;
  filters: FilterParams;
  matchingRecords?: number;
  onFilterChange: (newFilters: FilterParams) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  filters,
  matchingRecords,
  onFilterChange,
  onReset,
}) => {
  if (!options) return null;

  const hasActiveFilters =
    (filters.years && filters.years.length > 0) ||
    (filters.regions && filters.regions.length > 0) ||
    (filters.states && filters.states.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.sub_categories && filters.sub_categories.length > 0) ||
    (filters.segments && filters.segments.length > 0) ||
    (filters.ship_modes && filters.ship_modes.length > 0) ||
    filters.start_date ||
    filters.end_date;

  const handleYearToggle = (year: number) => {
    const current = filters.years || [];
    const updated = current.includes(year)
      ? current.filter(y => y !== year)
      : [...current, year];
    onFilterChange({ ...filters, years: updated.length ? updated : undefined });
  };

  const handleSelectChange = (key: keyof FilterParams, value: string) => {
    if (!value || value === 'ALL') {
      onFilterChange({ ...filters, [key]: undefined });
    } else {
      onFilterChange({ ...filters, [key]: [value] });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Global Filters
          </span>
          {matchingRecords !== undefined && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium ml-2">
              {matchingRecords.toLocaleString()} matching records
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="pt-3 space-y-3.5">
        {/* Year Pills Row */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Order Years
          </label>
          <div className="flex flex-wrap gap-1.5">
            {options.years.map(year => {
              const active = filters.years ? filters.years.includes(year) : false;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearToggle(year)}
                  className={`text-xs px-3 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Categorical Dropdowns in Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {/* Region */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              Region
            </label>
            <select
              value={filters.regions?.[0] || 'ALL'}
              onChange={e => handleSelectChange('regions', e.target.value)}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Regions</option>
              {options.regions.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Category
            </label>
            <select
              value={filters.categories?.[0] || 'ALL'}
              onChange={e => handleSelectChange('categories', e.target.value)}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Categories</option>
              {options.categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Segment */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Segment
            </label>
            <select
              value={filters.segments?.[0] || 'ALL'}
              onChange={e => handleSelectChange('segments', e.target.value)}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Segments</option>
              {options.segments.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Shipping Mode */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Truck className="w-3 h-3 text-slate-400" />
              Ship Mode
            </label>
            <select
              value={filters.ship_modes?.[0] || 'ALL'}
              onChange={e => handleSelectChange('ship_modes', e.target.value)}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Modes</option>
              {options.ship_modes.map(sm => (
                <option key={sm} value={sm}>
                  {sm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
