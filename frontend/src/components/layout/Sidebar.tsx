import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Globe2,
  Users,
  Truck,
  Database,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

export type NavPage =
  | 'overview'
  | 'sales'
  | 'products'
  | 'regions'
  | 'customers'
  | 'logistics'
  | 'explorer'
  | 'datascience';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  datasetName?: string;
  recordCount?: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: Array<{ id: NavPage; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales Analysis', icon: TrendingUp },
  { id: 'products', label: 'Product Performance', icon: Package },
  { id: 'regions', label: 'Regional Analysis', icon: Globe2 },
  { id: 'customers', label: 'Customer Insights', icon: Users },
  { id: 'logistics', label: 'Logistics & Stats', icon: Truck },
  { id: 'explorer', label: 'Data Explorer', icon: Database },
  { id: 'datascience', label: 'Data Science & ML', icon: BrainCircuit },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  datasetName = 'Sample - Superstore.csv',
  recordCount = 9994,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-30 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                SI
              </div>
              <div className="truncate">
                <div className="font-bold text-sm text-white tracking-tight leading-none">
                  Sales Intelligence
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Enterprise Analytics</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm mx-auto">
              SI
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dataset status footer */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800 m-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-200 truncate">
              {datasetName}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Active Dataset</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              {recordCount.toLocaleString()} rows
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center border-t border-slate-800 text-emerald-400" title={`${datasetName} (${recordCount} rows)`}>
          <FileSpreadsheet className="w-5 h-5 mx-auto" />
        </div>
      )}
    </aside>
  );
};
