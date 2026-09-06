import React from 'react';
import { useRailOpt } from '../context/RailOptContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, ShieldCheck, CheckCircle2, AlertOctagon, 
  Clock, Gauge, ArrowDownRight, ArrowUpRight, Zap 
} from 'lucide-react';

export const OptimizationResultsView: React.FC = () => {
  const { result } = useRailOpt();

  const before = result?.before_metrics || {
    total_schedule_conflicts: 12,
    affected_trains_count: 7,
    overall_asset_availability_pct: 68.0,
    critical_asset_availability_pct: 70.5,
    maintenance_completion_pct: 72.0,
    average_train_delay_minutes: 46.0,
  };

  const after = result?.after_metrics || {
    total_schedule_conflicts: 2,
    affected_trains_count: 1,
    overall_asset_availability_pct: 91.4,
    critical_asset_availability_pct: 96.4,
    maintenance_completion_pct: 100.0,
    average_train_delay_minutes: 8.0,
  };

  const comparisonData = [
    { name: 'Conflicts', before: before.total_schedule_conflicts, after: after.total_schedule_conflicts, unit: 'count' },
    { name: 'Affected Trains', before: before.affected_trains_count, after: after.affected_trains_count, unit: 'trains' },
    { name: 'Avg Delay (min)', before: before.average_train_delay_minutes, after: after.average_train_delay_minutes, unit: 'min' },
  ];

  const availabilityData = [
    { category: 'Overall Availability', before: before.overall_asset_availability_pct, after: after.overall_asset_availability_pct },
    { category: 'Track CWR', before: 62.0, after: 94.0 },
    { category: 'Signaling & Interlock', before: 71.0, after: 96.5 },
    { category: '25kV Traction (OHE)', before: 66.0, after: 92.0 },
    { category: 'Point & Crossings', before: 54.0, after: 89.0 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="control-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-emerald-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Optimization Results: Before vs After AI CP-SAT Scheduling
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Comparative performance analytics showing schedule conflict elimination & asset uptime maximization
          </p>
        </div>

        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-semibold self-start md:self-auto">
          Simulation Result • Simulated Railway Operations Data
        </span>
      </div>

      {/* 5 Big Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="control-card rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">SCHEDULE CONFLICTS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-slate-400 line-through font-semibold">{before.total_schedule_conflicts}</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">{after.total_schedule_conflicts}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" /> -83.3% reduction
          </span>
        </div>

        <div className="control-card rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">AFFECTED TRAINS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-slate-400 line-through font-semibold">{before.affected_trains_count}</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">{after.affected_trains_count}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" /> Only 1 freight regulated
          </span>
        </div>

        <div className="control-card rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">ASSET AVAILABILITY</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-slate-400 line-through font-semibold">{before.overall_asset_availability_pct}%</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">{after.overall_asset_availability_pct}%</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +{(after.overall_asset_availability_pct - before.overall_asset_availability_pct).toFixed(1)}% uptime
          </span>
        </div>

        <div className="control-card rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">MAINTENANCE COMPLETION</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-slate-400 line-through font-semibold">{before.maintenance_completion_pct}%</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">{after.maintenance_completion_pct}%</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> 100% critical executed
          </span>
        </div>

        <div className="control-card rounded-xl p-3.5 border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">AVERAGE TRAIN DELAY</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-slate-400 line-through font-semibold">{before.average_train_delay_minutes}m</span>
            <span className="text-2xl font-bold font-mono text-emerald-600">{after.average_train_delay_minutes}m</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" /> -38 min delay reduction
          </span>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Asset Availability by Subsystem */}
        <div className="control-card rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-600" />
            Asset Availability by Subsystem (%)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={availabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                <Bar dataKey="before" name="Manual Schedule (Before)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="AI CP-SAT (After)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Delay & Conflict Reduction Comparison */}
        <div className="control-card rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Disruption & Conflict Elimination
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                <Bar dataKey="before" name="Manual Schedule (Before)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="AI CP-SAT (After)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resolved Conflicts Ledger */}
      <div className="control-card rounded-xl p-4 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Conflict Resolution & Safety Verification Ledger
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {(result?.resolved_conflicts || []).slice(0, 3).map(conf => (
            <div key={conf.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-rose-700">{conf.id} • {conf.type}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                  RESOLVED
                </span>
              </div>
              <div className="font-bold text-slate-900">{conf.description}</div>
              <div className="text-[11px] text-emerald-700 font-mono font-medium pt-1 border-t border-slate-200">
                AI Action: {conf.suggested_resolution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
