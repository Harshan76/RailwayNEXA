import React from 'react';
import { useRailOpt } from '../context/RailOptContext';
import { OptimizationAnimation } from '../components/OptimizationAnimation';
import { 
  Sparkles, Play, ShieldAlert, Cpu, CheckCircle2, 
  ArrowRight, Activity, Clock, Users, TrainTrack, Wrench, RefreshCw 
} from 'lucide-react';

export const AIBlockPlannerView: React.FC = () => {
  const { 
    trains, assets, requests, crews, result, 
    triggerOptimization, isOptimizing, setActiveTab 
  } = useRailOpt();

  return (
    <div className="space-y-4">
      {/* Top Engine Animation Component */}
      <OptimizationAnimation />

      {/* 3-Column Core Solver Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Col: INPUTS */}
        <div className="control-card rounded-xl p-4 border border-slate-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200">
                <TrainTrack className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900">
                  Constraint & Input Vectors
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Real-time parameter ingestion across 6 dimensions
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrainTrack className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-800 font-medium">Train Timetable</span>
                </div>
                <span className="font-mono text-blue-700 font-bold">{trains.length} Services</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-slate-800 font-medium">Asset Health Matrix</span>
                </div>
                <span className="font-mono text-amber-700 font-bold">{assets.length} Monitored</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-slate-800 font-medium">Maintenance Queue</span>
                </div>
                <span className="font-mono text-purple-700 font-bold">{requests.length} Requests</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-800 font-medium">Field Maintenance Crews</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">{crews.length} Active Gangs</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-800 font-medium">Corridor Night Windows</span>
                </div>
                <span className="font-mono text-blue-700 font-bold">00:30 – 05:30</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-slate-800 font-medium">Safety Buffer Margin</span>
                </div>
                <span className="font-mono text-rose-700 font-bold">15 min Minimum</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
            Constraints formulated as Mixed-Integer Linear & Non-overlapping Intervals.
          </div>
        </div>

        {/* Center Col: AI OPTIMIZATION ENGINE TRIGGER */}
        <div className="control-card rounded-xl p-5 border border-blue-300 flex flex-col justify-between text-center relative overflow-hidden shadow-md bg-gradient-to-b from-blue-50/40 via-white to-indigo-50/40">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center mb-3">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Cpu className={`w-8 h-8 text-blue-600 ${isOptimizing ? 'animate-spin' : ''}`} />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-slate-900">
              Google OR-Tools CP-SAT Engine
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1 font-medium">
              Constraint-based mathematical solver minimizing passenger delay while maximizing corridor asset availability.
            </p>

            <div className="my-4 p-3 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-mono shadow-sm">
              <div className="flex justify-between text-slate-600">
                <span>Solver Core:</span>
                <span className="text-blue-700 font-bold">CP-SAT 9.15 (4 Workers)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Search Horizon:</span>
                <span className="text-blue-700 font-bold">1440 min (24h cyclic)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Loss Penalties:</span>
                <span className="text-rose-700 font-bold">Delay + Conflict + Crew Clash</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => triggerOptimization()}
              disabled={isOptimizing}
              className="w-full py-3 rounded-xl font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>SOLVING CONSTRAINTS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>GENERATE OPTIMAL BLOCK PLAN</span>
                </>
              )}
            </button>

            <div className="text-[10px] text-slate-500 font-mono font-medium">
              ⚡ Solves {requests.length} multi-department requests in ~15 ms
            </div>
          </div>
        </div>

        {/* Right Col: AI RECOMMENDATIONS & PREDICTED IMPACT */}
        <div className="control-card rounded-xl p-4 border border-blue-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900">
                  AI Optimization Recommendation
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Dynamic Schedule Modification Proposal
                </p>
              </div>
            </div>

            {/* Main AI Recommendation Card */}
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs space-y-2 mb-3">
              <div className="text-blue-900 font-bold leading-snug">
                "Shift Meerut–Aligarh S&T Relay Rack maintenance from 02:00 to 04:00 to avoid scheduled passenger movements."
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Creates an Integrated Shadow Corridor Block combining S&T Relay Rack + P&C Switch Overhaul on Section SEC-03, avoiding Prayagraj Express (IR-12418).
              </p>
            </div>

            {/* Predicted Impact Matrix */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Train Delay Impact:</span>
                <span className="font-mono text-emerald-700 font-bold">-38 min reduction</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Conflict Reduction:</span>
                <span className="font-mono text-emerald-700 font-bold">12 → 2 conflicts (-83%)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Asset Availability Gain:</span>
                <span className="font-mono text-emerald-700 font-bold">68% → 91.4% (+23.4%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('results')}
            className="w-full mt-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <span>View Before vs After Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
