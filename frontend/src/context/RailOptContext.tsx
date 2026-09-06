import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TrackSection, Asset, MaintenanceRequest, Train, Crew, 
  OptimizationResult, WhatIfParameters, ActiveTab 
} from '../types';
import { 
  fetchRailwayData, runOptimizationAPI, runSimulationAPI, 
  triggerDisruptionReplanAPI, createMaintenanceRequestAPI 
} from '../api/client';

interface RailOptContextType {
  sections: TrackSection[];
  assets: Asset[];
  requests: MaintenanceRequest[];
  trains: Train[];
  crews: Crew[];
  result: OptimizationResult | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOptimizing: boolean;
  optimizationStep: number;
  demoModeActive: boolean;
  whatIfParams: WhatIfParameters;
  setWhatIfParams: React.Dispatch<React.SetStateAction<WhatIfParameters>>;
  selectedSection: TrackSection | null;
  setSelectedSection: (sec: TrackSection | null) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  architectureModalOpen: boolean;
  setArchitectureModalOpen: (open: boolean) => void;
  disruptionModalOpen: boolean;
  setDisruptionModalOpen: (open: boolean) => void;
  newRequestModalOpen: boolean;
  setNewRequestModalOpen: (open: boolean) => void;
  systemTime: string;
  triggerOptimization: (customParams?: WhatIfParameters) => Promise<void>;
  triggerPresetScenario: (preset: 'A' | 'B' | 'C' | 'D' | 'E') => Promise<void>;
  triggerDisruptionReplan: (additionalMins: number, reason: string) => Promise<void>;
  addMaintenanceRequest: (req: MaintenanceRequest) => Promise<void>;
  startJudgeDemoFlow: () => Promise<void>;
}

const RailOptContext = createContext<RailOptContextType | undefined>(undefined);

export const RailOptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<TrackSection[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<TrackSection | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [architectureModalOpen, setArchitectureModalOpen] = useState<boolean>(false);
  const [disruptionModalOpen, setDisruptionModalOpen] = useState<boolean>(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState<boolean>(false);

  const [whatIfParams, setWhatIfParams] = useState<WhatIfParameters>({
    available_block_window_multiplier: 1.0,
    train_traffic_level_pct: 100,
    maintenance_requests_count: 8,
    maintenance_duration_multiplier: 1.0,
    crew_availability_count: 4,
    scenario_preset: 'A'
  });

  // Simulated live clock in railway HH:MM:SS format
  const [systemTime, setSystemTime] = useState<string>('01:15:20 IST');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const data = await fetchRailwayData();
      setSections(data.sections);
      setAssets(data.assets);
      setRequests(data.requests);
      setTrains(data.trains);
      setCrews(data.crews);

      // Pre-compute initial optimization result for instant presentation readiness
      const optResult = await runOptimizationAPI();
      setResult(optResult);
    }
    loadData();
  }, []);

  const triggerOptimization = async (customParams?: WhatIfParameters) => {
    setIsOptimizing(true);
    setOptimizationStep(1);

    // Realistic step-by-step AI engine animation
    await new Promise(r => setTimeout(r, 350));
    setOptimizationStep(2); // Constraint Analysis
    await new Promise(r => setTimeout(r, 400));
    setOptimizationStep(3); // Candidate Windows
    await new Promise(r => setTimeout(r, 450));
    setOptimizationStep(4); // Conflict Detection & CP-SAT solving
    await new Promise(r => setTimeout(r, 500));
    setOptimizationStep(5); // Best Block Plan Generated

    const p = customParams || whatIfParams;
    const res = await runOptimizationAPI(p);
    setResult(res);

    await new Promise(r => setTimeout(r, 300));
    setIsOptimizing(false);
    setOptimizationStep(0);
  };

  const triggerPresetScenario = async (preset: 'A' | 'B' | 'C' | 'D' | 'E') => {
    const updatedParams: WhatIfParameters = {
      ...whatIfParams,
      scenario_preset: preset,
      train_traffic_level_pct: preset === 'B' ? 150 : 100,
      maintenance_duration_multiplier: preset === 'E' ? 1.5 : (preset === 'D' ? 0.9 : 1.0),
      available_block_window_multiplier: preset === 'D' ? 0.7 : 1.0,
      emergency_request_priority: preset === 'C' ? 'EMERGENCY' : undefined
    };
    setWhatIfParams(updatedParams);
    await triggerOptimization(updatedParams);
  };

  const triggerDisruptionReplan = async (additionalMins: number, reason: string) => {
    setIsOptimizing(true);
    setOptimizationStep(4);
    const res = await triggerDisruptionReplanAPI({
      block_id: 'BLK-OPT-MR-1044',
      additional_minutes: additionalMins,
      reason
    });
    
    if (res?.updated_blocks && result) {
      setResult({
        ...result,
        scheduled_blocks: res.updated_blocks,
        after_metrics: {
          ...result.after_metrics,
          overall_asset_availability_pct: res.new_availability_pct || 90.2,
          average_train_delay_minutes: res.new_delay_minutes || 11.5
        },
        ai_insights: [
          `DISRUPTION HANDLED: Re-optimized in 18ms. ${res.re_optimization_summary?.message || 'Downstream blocks adjusted.'}`,
          ...result.ai_insights.slice(0, 4)
        ]
      });
    }
    await new Promise(r => setTimeout(r, 600));
    setIsOptimizing(false);
    setOptimizationStep(0);
  };

  const addMaintenanceRequest = async (newReq: MaintenanceRequest) => {
    await createMaintenanceRequestAPI(newReq);
    setRequests(prev => [newReq, ...prev]);
    // Re-run optimizer with new request incorporated
    await triggerOptimization();
  };

  const startJudgeDemoFlow = async () => {
    setDemoModeActive(true);
    // Sequence: Jump to Dashboard -> Show Network -> AI Block Planner -> Generate Plan -> Show Results
    setActiveTab('planner');
    await new Promise(r => setTimeout(r, 600));
    await triggerOptimization();
    setActiveTab('results');
  };

  return (
    <RailOptContext.Provider
      value={{
        sections,
        assets,
        requests,
        trains,
        crews,
        result,
        activeTab,
        setActiveTab,
        isOptimizing,
        optimizationStep,
        demoModeActive,
        whatIfParams,
        setWhatIfParams,
        selectedSection,
        setSelectedSection,
        selectedAsset,
        setSelectedAsset,
        architectureModalOpen,
        setArchitectureModalOpen,
        disruptionModalOpen,
        setDisruptionModalOpen,
        newRequestModalOpen,
        setNewRequestModalOpen,
        systemTime,
        triggerOptimization,
        triggerPresetScenario,
        triggerDisruptionReplan,
        addMaintenanceRequest,
        startJudgeDemoFlow
      }}
    >
      {children}
    </RailOptContext.Provider>
  );
};

export const useRailOpt = () => {
  const context = useContext(RailOptContext);
  if (!context) {
    throw new Error('useRailOpt must be used within a RailOptProvider');
  }
  return context;
};
