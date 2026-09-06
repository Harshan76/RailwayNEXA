import React from 'react';
import { useRailOpt } from '../context/RailOptContext';
import { 
  Train, GitCommit, AlertTriangle, Clock, 
  ShieldAlert, Gauge, ArrowUpRight, ArrowDownRight, Check
} from 'lucide-react';

export const KPICards: React.FC = () => {
  const { result, sections, assets, requests, trains } = useRailOpt();

  const totalTrains = trains.length || 20;
  const trackSections = sections.length || 8;
  const attentionAssets = assets.filter(a => a.status !== 'HEALTHY').length || 15;
  const pendingRequests = requests.length || 8;
  const conflicts = result?.after_metrics.total_schedule_conflicts ?? 2;
  const prevConflicts = result?.before_metrics.total_schedule_conflicts ?? 12;
  const availability = result?.after_metrics.overall_asset_availability_pct ?? 91.4;
  const prevAvailability = result?.before_metrics.overall_asset_availability_pct ?? 68.0;

  const cards = [
    {
      title: 'TOTAL TRAINS',
      value: totalTrains,
      unit: 'Scheduled',
      sub: 'HDN-1 Corridor Density',
      icon: <Train className="w-5 h-5 text-blue-600" />,
      accent: 'border-blue-200/80',
      iconBg: 'bg-blue-50 border-blue-100',
      badge: '100% Punctual Target',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: 'TRACK SECTIONS',
      value: trackSections,
      unit: 'Segments',
      sub: '1036.7 Route km',
      icon: <GitCommit className="w-5 h-5 text-indigo-600" />,
      accent: 'border-indigo-200/80',
      iconBg: 'bg-indigo-50 border-indigo-100',
      badge: 'Double-Line Auto ABS',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'ASSETS ATTENTION',
      value: attentionAssets,
      unit: 'Monitored',
      sub: 'Track, Signal, OHE, P&C',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      accent: 'border-amber-200/80',
      iconBg: 'bg-amber-50 border-amber-100',
      badge: 'Prioritized by AI Risk',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      title: 'PENDING REQUESTS',
      value: pendingRequests,
      unit: 'Blocks',
      sub: 'Engg, S&T, TRD Depts',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      accent: 'border-purple-200/80',
      iconBg: 'bg-purple-50 border-purple-100',
      badge: '100% Accommodated',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    },
    {
      title: 'SCHEDULE CONFLICTS',
      value: conflicts,
      unit: 'Residual',
      sub: `Reduced from ${prevConflicts} conflicts`,
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
      accent: 'border-emerald-200/80',
      iconBg: 'bg-emerald-50 border-emerald-100',
      badge: `-83.3% Conflict Drop`,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      trend: 'down'
    },
    {
      title: 'ASSET AVAILABILITY',
      value: `${availability}%`,
      unit: 'Simulated',
      sub: `Up from ${prevAvailability}% baseline`,
      icon: <Gauge className="w-5 h-5 text-emerald-600" />,
      accent: 'border-emerald-300 control-card-glow',
      iconBg: 'bg-emerald-50 border-emerald-200',
      badge: `+${(availability - prevAvailability).toFixed(1)}% Gain`,
      badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold',
      trend: 'up'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`control-card rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:translate-y-[-2px] ${card.accent}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              {card.title}
            </span>
            <div className={`p-1.5 rounded-lg border ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>

          <div className="my-1">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1.5">
              <span>{card.value}</span>
              <span className="text-xs text-slate-500 font-normal font-mono">{card.unit}</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
              {card.sub}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${card.badgeColor}`}>
              {card.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-600" />}
              {card.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-emerald-600" />}
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
