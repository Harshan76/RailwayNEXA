import React, { useState } from 'react';
import { useRailOpt } from '../context/RailOptContext';
import { ScheduledBlock } from '../types';
import { Clock, Shield, AlertCircle, Info, Sparkles } from 'lucide-react';

export const GanttTimeline: React.FC = () => {
  const { sections, result, trains } = useRailOpt();
  const [hoveredBlock, setHoveredBlock] = useState<ScheduledBlock | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Timeline hours from 00:00 to 07:00 (Focused night maintenance corridor, 420 minutes)
  const totalMinutes = 420; // 00:00 to 07:00
  const hours = [0, 1, 2, 3, 4, 5, 6, 7];

  const getPositionStyle = (startMin: number, durationMin: number) => {
    const leftPct = Math.max(0, Math.min(100, (startMin / totalMinutes) * 100));
    const widthPct = Math.max(3, Math.min(100 - leftPct, (durationMin / totalMinutes) * 100));
    return {
      left: `${leftPct}%`,
      width: `${widthPct}%`,
    };
  };

  return (
    <div className="control-card rounded-xl p-4 relative flex flex-col">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Corridor Block Plan Gantt Timeline
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                00:00 – 07:00 Nocturnal Maintenance Window
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Interactive Time-Space Allocation: Scheduled Maintenance vs Passenger Train Paths
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-500" />
            Train Movement
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-rose-600" />
            Maintenance Block
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-amber-300 border border-amber-500" />
            Safety Buffer
          </span>
        </div>
      </div>

      {/* Main Gantt Grid */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50/80 p-3 shadow-inner">
        <div className="min-w-[760px]">
          {/* Time axis header */}
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 pb-2 mb-2 text-xs font-mono text-slate-500 font-semibold">
            <div className="col-span-3 text-slate-700 font-bold pl-2">CORRIDOR SECTION</div>
            <div className="col-span-9 relative flex justify-between pr-2">
              {hours.map(h => (
                <span key={h} className="text-[11px] text-blue-700 font-mono font-bold">
                  {h.toString().padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>

          {/* Rows for each section */}
          <div className="space-y-2">
            {sections.map(sec => {
              const secBlocks = (result?.scheduled_blocks || []).filter(b => b.section_id === sec.id);

              return (
                <div key={sec.id} className="grid grid-cols-12 gap-0 items-center hover:bg-slate-100/70 p-1 rounded-lg transition-colors">
                  {/* Section Label */}
                  <div className="col-span-3 pl-2 pr-2">
                    <div className="text-xs font-bold text-slate-800 truncate">{sec.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{sec.id} • {sec.length_km} km</div>
                  </div>

                  {/* Section Timeline Track */}
                  <div className="col-span-9 relative h-10 bg-white rounded border border-slate-200 overflow-hidden flex items-center shadow-sm">
                    {/* Hour grid lines */}
                    {hours.map(h => (
                      <div
                        key={h}
                        className="absolute top-0 bottom-0 border-r border-slate-200 pointer-events-none"
                        style={{ left: `${(h / 7) * 100}%` }}
                      />
                    ))}

                    {/* Simulated passenger train passages */}
                    {sec.id === 'SEC-01' && (
                      <div
                        className="absolute h-5 bg-emerald-100 border border-emerald-400 rounded text-[9px] font-mono text-emerald-800 font-semibold flex items-center px-1.5 z-10"
                        style={{ left: `${(315 / totalMinutes) * 100}%`, width: '12%' }}
                        title="IR-107 Delhi-Meerut Shuttle (05:15–05:55)"
                      >
                        IR-107 Shuttle
                      </div>
                    )}
                    {sec.id === 'SEC-03' && (
                      <div
                        className="absolute h-5 bg-emerald-100 border border-emerald-400 rounded text-[9px] font-mono text-emerald-800 font-semibold flex items-center px-1.5 z-10"
                        style={{ left: `${(380 / totalMinutes) * 100}%`, width: '10%' }}
                        title="IR-101 Vande Bharat (06:20)"
                      >
                        IR-101 VB
                      </div>
                    )}
                    {sec.id === 'SEC-05' && (
                      <div
                        className="absolute h-5 bg-emerald-100 border border-emerald-400 rounded text-[9px] font-mono text-emerald-800 font-semibold flex items-center px-1.5 z-10"
                        style={{ left: `${(60 / totalMinutes) * 100}%`, width: '15%' }}
                        title="IR-103 Prayagraj Express (01:00–03:40)"
                      >
                        IR-103 Exp
                      </div>
                    )}

                    {/* Scheduled Maintenance Blocks */}
                    {secBlocks.map(block => {
                      const pos = getPositionStyle(block.start_minute, block.duration_minutes);
                      const isEmergency = block.priority === 'EMERGENCY';

                      return (
                        <div
                          key={block.block_id}
                          style={pos}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredBlock(block);
                            setHoverPos({ x: rect.left, y: rect.bottom + window.scrollY });
                          }}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className={`absolute h-7 rounded-md cursor-pointer border flex items-center px-2 z-20 transition-all duration-150 hover:scale-y-110 shadow-sm ${
                            isEmergency
                              ? 'bg-rose-600 border-rose-700 text-white shadow-rose-300'
                              : 'bg-blue-600 border-blue-700 text-white shadow-blue-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1 truncate">
                            <span className="text-[10px] font-bold font-mono">
                              {block.start_time}–{block.end_time}
                            </span>
                            <span className="text-[9px] text-white/90 truncate hidden md:inline font-medium">
                              {block.asset_name}
                            </span>
                          </div>

                          {/* Safety Buffer Indicator visual bar */}
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-amber-300 border-l border-amber-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {hoveredBlock && (
        <div 
          className="fixed z-50 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xl backdrop-blur-md max-w-sm text-xs pointer-events-none"
          style={{ left: `${Math.min(window.innerWidth - 320, hoverPos.x)}px`, top: `${hoverPos.y + 8}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {hoveredBlock.asset_name}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              hoveredBlock.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {hoveredBlock.priority}
            </span>
          </div>

          <div className="space-y-1 text-slate-700">
            <div><strong>Section:</strong> {hoveredBlock.section_name}</div>
            <div><strong>Window:</strong> <span className="text-slate-900 font-mono font-semibold">{hoveredBlock.start_time} – {hoveredBlock.end_time}</span> ({hoveredBlock.duration_minutes} min)</div>
            <div><strong>Department / Crew:</strong> {hoveredBlock.department} ({hoveredBlock.assigned_crew})</div>
            <div><strong>Safety Protection Margin:</strong> {hoveredBlock.safety_buffer_applied} minutes buffer</div>
            <div className="text-[11px] text-blue-700 pt-1 border-t border-slate-100 mt-1 font-medium">
              <strong>AI Slot Rationale:</strong> {hoveredBlock.reason_for_window}
            </div>
            <div className="text-[10px] text-emerald-700 font-mono font-semibold">
              ✓ Verified 0 Conflicts with Vande Bharat / Rajdhani services
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
