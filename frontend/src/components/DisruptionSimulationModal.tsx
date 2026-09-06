import React, { useState } from 'react';
import { useRailOpt } from '../context/RailOptContext';
import { X, AlertTriangle, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

export const DisruptionSimulationModal: React.FC = () => {
  const { disruptionModalOpen, setDisruptionModalOpen, triggerDisruptionReplan, isOptimizing } = useRailOpt();
  const [additionalMinutes, setAdditionalMinutes] = useState<number>(90);
  const [reason, setReason] = useState<string>('OHE Mast Structural Anchor Replacement Overrun on Ghaziabad–Meerut');
  const [disruptionApplied, setDisruptionApplied] = useState<boolean>(false);

  if (!disruptionModalOpen) return null;

  const handleSimulate = async () => {
    await triggerDisruptionReplan(additionalMinutes, reason);
    setDisruptionApplied(true);
    setTimeout(() => {
      setDisruptionApplied(false);
      setDisruptionModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-amber-300 shadow-2xl p-6 relative">
        <button
          onClick={() => setDisruptionModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Dynamic Disruption Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Inject unforeseen live operational delays to verify AI auto-replanning
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Select Disrupted Active Block:
            </label>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-800 text-[11px]">
              BLK-OPT-MR-1044: OHE Catenary Stagger Adjustment (Ghaziabad–Meerut)
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Unexpected Duration Overrun (Minutes):
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={additionalMinutes}
                onChange={(e) => setAdditionalMinutes(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 text-sm shrink-0">
                +{additionalMinutes} min
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Field Fault / Overrun Cause:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:border-amber-500 focus:bg-white outline-none transition"
            />
          </div>

          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-slate-700 space-y-1">
            <div className="font-semibold text-amber-800">Expected AI Solver Response:</div>
            <div>1. Detects potential clash with incoming passenger trains.</div>
            <div>2. Dynamically shifts downstream S&T block from 02:00–04:00 to 03:30–05:30.</div>
            <div>3. Preserves 100% punctuality for Vande Bharat & Rajdhani expresses.</div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isOptimizing}
            className="w-full py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                AI Re-optimizing Schedule...
              </>
            ) : disruptionApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                Re-plan Applied Successfully!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Inject Disruption & Trigger AI Re-plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
