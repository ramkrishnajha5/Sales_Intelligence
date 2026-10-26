import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  tooltip?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  tooltip,
}) => {
  return (
    <div
      className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
      title={tooltip}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-1.5">
        <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
          {value}
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-100 gap-2">
          <span className="truncate text-[11px] text-slate-400 font-normal">{subtitle}</span>
          {badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 ${
                badge.isNeutral
                  ? 'bg-slate-100 text-slate-600'
                  : badge.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
