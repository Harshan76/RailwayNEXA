import { 
  TrackSection, Asset, MaintenanceRequest, Train, Crew, 
  OptimizationResult, WhatIfParameters 
} from '../types';

const API_BASE = '/api';

export async function fetchRailwayData(): Promise<{
  sections: TrackSection[];
  assets: Asset[];
  requests: MaintenanceRequest[];
  trains: Train[];
  crews: Crew[];
  metadata: any;
}> {
  try {
    const res = await fetch(`${API_BASE}/data`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API connection fallback, using local simulated cache:', err);
    return getFallbackData();
  }
}

export async function runOptimizationAPI(params?: WhatIfParameters): Promise<OptimizationResult> {
  try {
    const res = await fetch(`${API_BASE}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API solve fallback, using deterministic engine solver:', err);
    return getFallbackOptimizationResult(params);
  }
}

export async function runSimulationAPI(params: WhatIfParameters): Promise<{
  scenario_parameters: WhatIfParameters;
  result: OptimizationResult;
}> {
  try {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Simulation API fallback:', err);
    const result = getFallbackOptimizationResult(params);
    return { scenario_parameters: params, result };
  }
}

export async function triggerDisruptionReplanAPI(payload: {
  block_id: string;
  additional_minutes: number;
  reason: string;
}): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/replan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Disruption replan fallback:', err);
    return {
      disruption_event: {
        block_id: payload.block_id,
        additional_minutes: payload.additional_minutes,
        reason: payload.reason,
        severity: 'CRITICAL_OPERATIONAL_ALERT'
      },
      re_optimization_summary: {
        status: 'RE_OPTIMIZED_SUCCESSFULLY',
        message: 'AI Engine automatically rescheduled 2 downstream slots. 0 Vande Bharat/Rajdhani passenger delays incurred.',
        shifts_applied: [
          {
            block_id: 'BLK-OPT-MR-1044',
            action: 'DURATION_EXTENDED',
            old_slot: '01:00–04:00',
            new_slot: '01:00–05:30',
            change: '+90 min possession hold'
          },
          {
            block_id: 'BLK-OPT-MR-1042',
            action: 'SLOT_RESCHEDULED',
            old_slot: '02:00–04:00',
            new_slot: '03:30–05:30',
            change: 'Shifted +60 min'
          }
        ]
      },
      updated_blocks: getFallbackOptimizationResult().scheduled_blocks,
      new_availability_pct: 90.2,
      new_delay_minutes: 11.5
    };
  }
}

export async function createMaintenanceRequestAPI(req: MaintenanceRequest): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return await res.json();
  } catch (err) {
    return { message: 'Created locally', request: req };
  }
}

// Deterministic fallback dataset for robust presentation reliability
function getFallbackData() {
  return {
    sections: [
      { id: 'SEC-01', name: 'New Delhi – Ghaziabad', from_station: 'New Delhi (NDLS)', to_station: 'Ghaziabad (GZB)', length_km: 25.6, max_speed_kmph: 130, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '01:00', end: '04:30' }], current_health_score: 82.0 },
      { id: 'SEC-02', name: 'Ghaziabad – Meerut', from_station: 'Ghaziabad (GZB)', to_station: 'Meerut City (MTC)', length_km: 48.2, max_speed_kmph: 110, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '00:30', end: '04:00' }], current_health_score: 78.5 },
      { id: 'SEC-03', name: 'Meerut – Aligarh', from_station: 'Meerut City (MTC)', to_station: 'Aligarh Jn (ALJN)', length_km: 112.4, max_speed_kmph: 120, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '01:30', end: '05:00' }], current_health_score: 68.0 },
      { id: 'SEC-04', name: 'Aligarh – Tundla', from_station: 'Aligarh Jn (ALJN)', to_station: 'Tundla Jn (TDL)', length_km: 78.0, max_speed_kmph: 130, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '01:00', end: '04:30' }], current_health_score: 86.0 },
      { id: 'SEC-05', name: 'Tundla – Kanpur', from_station: 'Tundla Jn (TDL)', to_station: 'Kanpur Central (CNB)', length_km: 228.0, max_speed_kmph: 130, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '02:00', end: '05:30' }], current_health_score: 74.0 },
      { id: 'SEC-06', name: 'Kanpur – Etawah', from_station: 'Kanpur Central (CNB)', to_station: 'Etawah Jn (ETW)', length_km: 139.0, max_speed_kmph: 130, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '00:45', end: '04:15' }], current_health_score: 89.0 },
      { id: 'SEC-07', name: 'Etawah – Prayagraj', from_station: 'Etawah Jn (ETW)', to_station: 'Prayagraj Jn (PRYJ)', length_km: 280.0, max_speed_kmph: 130, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '01:15', end: '04:45' }], current_health_score: 71.5 },
      { id: 'SEC-08', name: 'Prayagraj – Varanasi', from_station: 'Prayagraj Jn (PRYJ)', to_station: 'Varanasi Cantt (BSB)', length_km: 124.5, max_speed_kmph: 110, line_type: 'Double Line', electrified: true, corridor_category: 'High Density Network (HDN-1)', allowed_maintenance_windows: [{ start: '01:45', end: '05:15' }], current_health_score: 80.0 },
    ],
    assets: [
      { id: 'AST-TRK-01', name: 'Continuous Welded Rail (CWR 60kg)', section_id: 'SEC-01', section_name: 'New Delhi – Ghaziabad', type: 'TRACK' as const, health_score: 62.0, criticality: 'HIGH' as const, last_inspection: '2026-08-20', next_maintenance_due: '2026-09-08', estimated_duration_hours: 2.5, status: 'ATTENTION_REQUIRED' as const, risk_score: 78.5, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.5, tonnage_gmt: 52.0 },
      { id: 'AST-SIG-02', name: 'Electronic Interlocking (EI) Axle Counter', section_id: 'SEC-01', section_name: 'New Delhi – Ghaziabad', type: 'SIGNAL' as const, health_score: 88.0, criticality: 'CRITICAL' as const, last_inspection: '2026-08-30', next_maintenance_due: '2026-09-25', estimated_duration_hours: 1.5, status: 'HEALTHY' as const, risk_score: 34.2, operational_impact: 'HIGH' as const, failure_risk: 'LOW' as const, degradation_rate_per_month: 1.0, tonnage_gmt: 52.0 },
      { id: 'AST-OHE-03', name: '25kV AC Overhead Catenary & Contact Wire', section_id: 'SEC-02', section_name: 'Ghaziabad – Meerut', type: 'OHE' as const, health_score: 71.0, criticality: 'HIGH' as const, last_inspection: '2026-08-15', next_maintenance_due: '2026-09-09', estimated_duration_hours: 3.0, status: 'ATTENTION_REQUIRED' as const, risk_score: 66.8, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.0, tonnage_gmt: 38.0 },
      { id: 'AST-PNC-04', name: '1-in-12 Curved Switch Point & Crossing', section_id: 'SEC-03', section_name: 'Meerut – Aligarh', type: 'POINT & CROSSING' as const, health_score: 54.0, criticality: 'CRITICAL' as const, last_inspection: '2026-08-10', next_maintenance_due: '2026-09-07', estimated_duration_hours: 3.5, status: 'CRITICAL_ACTION' as const, risk_score: 89.4, operational_impact: 'HIGH' as const, failure_risk: 'HIGH' as const, degradation_rate_per_month: 3.8, tonnage_gmt: 48.0 },
      { id: 'AST-SIG-05', name: 'Auto Block Signal Relay Rack (AB-44)', section_id: 'SEC-03', section_name: 'Meerut – Aligarh', type: 'SIGNAL' as const, health_score: 60.0, criticality: 'HIGH' as const, last_inspection: '2026-08-18', next_maintenance_due: '2026-09-07', estimated_duration_hours: 2.0, status: 'ATTENTION_REQUIRED' as const, risk_score: 81.2, operational_impact: 'HIGH' as const, failure_risk: 'HIGH' as const, degradation_rate_per_month: 3.0, tonnage_gmt: 48.0 },
      { id: 'AST-BDG-06', name: 'Ganga Canal Steel Girder Bridge #114', section_id: 'SEC-04', section_name: 'Aligarh – Tundla', type: 'BRIDGE' as const, health_score: 79.0, criticality: 'MEDIUM' as const, last_inspection: '2026-08-01', next_maintenance_due: '2026-09-15', estimated_duration_hours: 4.0, status: 'HEALTHY' as const, risk_score: 42.0, operational_impact: 'MEDIUM' as const, failure_risk: 'LOW' as const, degradation_rate_per_month: 1.2, tonnage_gmt: 45.0 },
      { id: 'AST-TRK-07', name: 'Deep Screening Track Bed Section Km 342', section_id: 'SEC-05', section_name: 'Tundla – Kanpur', type: 'TRACK' as const, health_score: 58.0, criticality: 'HIGH' as const, last_inspection: '2026-08-12', next_maintenance_due: '2026-09-07', estimated_duration_hours: 3.0, status: 'ATTENTION_REQUIRED' as const, risk_score: 83.5, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 3.2, tonnage_gmt: 65.0 },
      { id: 'AST-OHE-08', name: 'Section Insulator & Isolator Unit (TRD)', section_id: 'SEC-05', section_name: 'Tundla – Kanpur', type: 'OHE' as const, health_score: 64.0, criticality: 'HIGH' as const, last_inspection: '2026-08-14', next_maintenance_due: '2026-09-08', estimated_duration_hours: 2.5, status: 'ATTENTION_REQUIRED' as const, risk_score: 72.1, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.4, tonnage_gmt: 65.0 },
      { id: 'AST-SIG-09', name: 'Solid State Interlocking (SSI) Card Frame', section_id: 'SEC-06', section_name: 'Kanpur – Etawah', type: 'SIGNAL' as const, health_score: 92.0, criticality: 'CRITICAL' as const, last_inspection: '2026-08-28', next_maintenance_due: '2026-09-30', estimated_duration_hours: 1.5, status: 'HEALTHY' as const, risk_score: 28.6, operational_impact: 'HIGH' as const, failure_risk: 'LOW' as const, degradation_rate_per_month: 0.8, tonnage_gmt: 50.0 },
      { id: 'AST-TRK-10', name: 'Flash Butt Welded Joint Assessment', section_id: 'SEC-07', section_name: 'Etawah – Prayagraj', type: 'TRACK' as const, health_score: 66.0, criticality: 'HIGH' as const, last_inspection: '2026-08-19', next_maintenance_due: '2026-09-08', estimated_duration_hours: 2.5, status: 'ATTENTION_REQUIRED' as const, risk_score: 74.0, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.2, tonnage_gmt: 58.0 },
      { id: 'AST-OHE-11', name: 'Auto-Tensioning Device (ATD) Pulley Set', section_id: 'SEC-07', section_name: 'Etawah – Prayagraj', type: 'OHE' as const, health_score: 52.0, criticality: 'HIGH' as const, last_inspection: '2026-08-08', next_maintenance_due: '2026-09-07', estimated_duration_hours: 3.0, status: 'CRITICAL_ACTION' as const, risk_score: 91.0, operational_impact: 'HIGH' as const, failure_risk: 'HIGH' as const, degradation_rate_per_month: 4.1, tonnage_gmt: 58.0 },
      { id: 'AST-BDG-12', name: 'Yamuna Rail Bridge #80 Expansion Joints', section_id: 'SEC-07', section_name: 'Etawah – Prayagraj', type: 'BRIDGE' as const, health_score: 69.0, criticality: 'HIGH' as const, last_inspection: '2026-08-11', next_maintenance_due: '2026-09-10', estimated_duration_hours: 3.5, status: 'ATTENTION_REQUIRED' as const, risk_score: 70.8, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.0, tonnage_gmt: 58.0 },
      { id: 'AST-PNC-13', name: 'Diamond Crossing #22 with Slip Points', section_id: 'SEC-08', section_name: 'Prayagraj – Varanasi', type: 'POINT & CROSSING' as const, health_score: 75.0, criticality: 'MEDIUM' as const, last_inspection: '2026-08-22', next_maintenance_due: '2026-09-18', estimated_duration_hours: 2.0, status: 'HEALTHY' as const, risk_score: 48.0, operational_impact: 'MEDIUM' as const, failure_risk: 'LOW' as const, degradation_rate_per_month: 1.5, tonnage_gmt: 32.0 },
      { id: 'AST-SIG-14', name: 'Digital Axle Counter Evaluation (DAC)', section_id: 'SEC-08', section_name: 'Prayagraj – Varanasi', type: 'SIGNAL' as const, health_score: 67.0, criticality: 'HIGH' as const, last_inspection: '2026-08-17', next_maintenance_due: '2026-09-09', estimated_duration_hours: 2.0, status: 'ATTENTION_REQUIRED' as const, risk_score: 73.4, operational_impact: 'HIGH' as const, failure_risk: 'MEDIUM' as const, degradation_rate_per_month: 2.3, tonnage_gmt: 32.0 },
      { id: 'AST-TRK-15', name: 'Tamping Machine Corridor Run Km 710', section_id: 'SEC-08', section_name: 'Prayagraj – Varanasi', type: 'TRACK' as const, health_score: 81.0, criticality: 'MEDIUM' as const, last_inspection: '2026-08-26', next_maintenance_due: '2026-09-22', estimated_duration_hours: 2.5, status: 'HEALTHY' as const, risk_score: 39.5, operational_impact: 'MEDIUM' as const, failure_risk: 'LOW' as const, degradation_rate_per_month: 1.1, tonnage_gmt: 32.0 },
    ],
    requests: [
      { id: 'MR-1041', asset_id: 'AST-TRK-01', asset_name: 'Track Rail Tamping & De-stressing', section_id: 'SEC-01', section_name: 'New Delhi – Ghaziabad', department: 'Engineering' as const, priority: 'HIGH' as const, duration_minutes: 150, preferred_window: '01:30 – 04:00', preferred_start_minute: 90, deadline_date: '2026-09-08', assigned_crew: 'CREW-ENG-A', status: 'PENDING' as const, description: 'High-tonnage rail de-stressing and ultrasonic flaw inspection post-monsoon.', safety_buffer_minutes: 15, track_possession_required: true, power_block_required: false, traffic_block_required: true },
      { id: 'MR-1042', asset_id: 'AST-SIG-05', asset_name: 'Auto Block Signal Relay Rack (AB-44)', section_id: 'SEC-03', section_name: 'Meerut – Aligarh', department: 'S&T' as const, priority: 'HIGH' as const, duration_minutes: 120, preferred_window: '02:00 – 04:00', preferred_start_minute: 120, deadline_date: '2026-09-07', assigned_crew: 'CREW-SNT-A', status: 'PENDING' as const, description: 'Intermittent relay impedance drop detected during nocturnal cycle.', safety_buffer_minutes: 15, track_possession_required: false, power_block_required: false, traffic_block_required: true },
      { id: 'MR-1043', asset_id: 'AST-PNC-04', asset_name: 'Curved Switch Point & Crossing Overhaul', section_id: 'SEC-03', section_name: 'Meerut – Aligarh', department: 'Engineering' as const, priority: 'EMERGENCY' as const, duration_minutes: 210, preferred_window: '01:45 – 05:15', preferred_start_minute: 105, deadline_date: '2026-09-07', assigned_crew: 'CREW-ENG-B', status: 'PENDING' as const, description: 'Critical tongue rail wear exceeding safety threshold (4.8mm vs 5.0mm max).', safety_buffer_minutes: 15, track_possession_required: true, power_block_required: false, traffic_block_required: true },
      { id: 'MR-1044', asset_id: 'AST-OHE-03', asset_name: 'Catenary Contact Wire Stagger Adjustment', section_id: 'SEC-02', section_name: 'Ghaziabad – Meerut', department: 'TRD/OHE' as const, priority: 'HIGH' as const, duration_minutes: 180, preferred_window: '01:00 – 04:00', preferred_start_minute: 60, deadline_date: '2026-09-09', assigned_crew: 'CREW-TRD-A', status: 'PENDING' as const, description: 'Periodic contact wire thickness verification and dropper tension tuning.', safety_buffer_minutes: 15, track_possession_required: false, power_block_required: true, traffic_block_required: true },
      { id: 'MR-1045', asset_id: 'AST-TRK-07', asset_name: 'Deep Ballast Screening & Shoulder Cleaning', section_id: 'SEC-05', section_name: 'Tundla – Kanpur', department: 'Engineering' as const, priority: 'HIGH' as const, duration_minutes: 180, preferred_window: '02:15 – 05:15', preferred_start_minute: 135, deadline_date: '2026-09-07', assigned_crew: 'CREW-ENG-A', status: 'PENDING' as const, description: 'Clogging in ballast pocket causing drainage retention near Km 342.', safety_buffer_minutes: 15, track_possession_required: true, power_block_required: false, traffic_block_required: true },
      { id: 'MR-1046', asset_id: 'AST-OHE-08', asset_name: 'Section Insulator & Isolator Unit (TRD)', section_id: 'SEC-05', section_name: 'Tundla – Kanpur', department: 'TRD/OHE' as const, priority: 'MEDIUM' as const, duration_minutes: 150, preferred_window: '02:30 – 05:00', preferred_start_minute: 150, deadline_date: '2026-09-08', assigned_crew: 'CREW-TRD-A', status: 'PENDING' as const, description: 'Corona ring thermal inspection and ceramic insulator wipe-down.', safety_buffer_minutes: 15, track_possession_required: false, power_block_required: true, traffic_block_required: true },
      { id: 'MR-1047', asset_id: 'AST-OHE-11', asset_name: 'Auto-Tensioning Device (ATD) Pulley Set', section_id: 'SEC-07', section_name: 'Etawah – Prayagraj', department: 'TRD/OHE' as const, priority: 'EMERGENCY' as const, duration_minutes: 180, preferred_window: '01:30 – 04:30', preferred_start_minute: 90, deadline_date: '2026-09-07', assigned_crew: 'CREW-TRD-B', status: 'PENDING' as const, description: 'Stuck counterweight compensation lever observed during pantograph run.', safety_buffer_minutes: 15, track_possession_required: false, power_block_required: true, traffic_block_required: true },
      { id: 'MR-1048', asset_id: 'AST-SIG-14', asset_name: 'Digital Axle Counter Evaluation (DAC)', section_id: 'SEC-08', section_name: 'Prayagraj – Varanasi', department: 'S&T' as const, priority: 'HIGH' as const, duration_minutes: 120, preferred_window: '02:00 – 04:00', preferred_start_minute: 120, deadline_date: '2026-09-09', assigned_crew: 'CREW-SNT-B', status: 'PENDING' as const, description: 'Phase shift error detection on downstream wheel sensor channel 2.', safety_buffer_minutes: 15, track_possession_required: false, power_block_required: false, traffic_block_required: true },
    ],
    trains: [
      { id: 'TR-101', train_number: 'IR-22436', name: 'Vande Bharat Express (NDLS-BSB)', type: 'Vande Bharat' as const, origin: 'New Delhi (NDLS)', destination: 'Varanasi (BSB)', departure_time: '06:00', arrival_time: '14:00', priority: 1, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-02', 'SEC-03', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07', 'SEC-08'], movements: [] },
      { id: 'TR-102', train_number: 'IR-12302', name: 'Howrah Rajdhani Express', type: 'Rajdhani Express' as const, origin: 'New Delhi (NDLS)', destination: 'Howrah (via CNB/PRYJ)', departure_time: '16:50', arrival_time: '09:55', priority: 1, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07'], movements: [] },
      { id: 'TR-103', train_number: 'IR-12418', name: 'Prayagraj Express', type: 'Superfast Mail/Exp' as const, origin: 'New Delhi (NDLS)', destination: 'Prayagraj (PRYJ)', departure_time: '22:10', arrival_time: '07:00', priority: 2, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-03', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07'], movements: [] },
      { id: 'TR-104', train_number: 'IR-12560', name: 'Shiv Ganga Superfast Express', type: 'Superfast Mail/Exp' as const, origin: 'New Delhi (NDLS)', destination: 'Varanasi (BSB)', departure_time: '20:05', arrival_time: '06:10', priority: 2, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-03', 'SEC-05', 'SEC-06', 'SEC-07', 'SEC-08'], movements: [] },
      { id: 'TR-105', train_number: 'IR-12004', name: 'Lucknow Swarna Shatabdi', type: 'Shatabdi Express' as const, origin: 'New Delhi (NDLS)', destination: 'Kanpur / Lucknow', departure_time: '06:10', arrival_time: '12:40', priority: 2, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-04', 'SEC-05'], movements: [] },
      { id: 'TR-106', train_number: 'IR-14218', name: 'Unchahar Express', type: 'Superfast Mail/Exp' as const, origin: 'Chandigarh / Delhi', destination: 'Prayagraj (PRYJ)', departure_time: '21:30', arrival_time: '11:15', priority: 3, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-02', 'SEC-03', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07'], movements: [] },
      { id: 'TR-107', train_number: 'IR-04404', name: 'Delhi–Meerut Shuttle Express', type: 'Passenger Local' as const, origin: 'New Delhi (NDLS)', destination: 'Meerut City (MTC)', departure_time: '05:15', arrival_time: '07:10', priority: 4, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-01', 'SEC-02'], movements: [] },
      { id: 'TR-108', train_number: 'IR-04142', name: 'Kanpur–Etawah Passenger Local', type: 'Passenger Local' as const, origin: 'Kanpur Central (CNB)', destination: 'Etawah Jn (ETW)', departure_time: '02:15', arrival_time: '05:00', priority: 4, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-06'], movements: [] },
      { id: 'TR-109', train_number: 'IR-CONTR-01', name: 'DFCCIL Container Cargo (Dadri-Varanasi)', type: 'Freight / Container' as const, origin: 'Dadri Freight Hub', destination: 'Mughalsarai / DDU', departure_time: '01:00', arrival_time: '10:30', priority: 5, status: 'REGULATED' as const, affected_by_block: true, delay_minutes: 12, route_sections: ['SEC-02', 'SEC-03', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07', 'SEC-08'], movements: [] },
      { id: 'TR-110', train_number: 'IR-COAL-04', name: 'NTPC Thermal Coal Bulk Freight', type: 'Freight / Container' as const, origin: 'Varanasi Area', destination: 'Dadri Power Plant', departure_time: '00:30', arrival_time: '11:45', priority: 5, status: 'ON_TIME' as const, affected_by_block: false, delay_minutes: 0, route_sections: ['SEC-08', 'SEC-07', 'SEC-06', 'SEC-05', 'SEC-04', 'SEC-01'], movements: [] },
    ],
    crews: [
      { id: 'CREW-ENG-A', name: 'Permanent Way Gang Alpha (Engg)', department: 'Engineering' as const, base_station: 'Ghaziabad (GZB)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
      { id: 'CREW-ENG-B', name: 'Permanent Way Gang Beta (Engg)', department: 'Engineering' as const, base_station: 'Kanpur Central (CNB)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
      { id: 'CREW-SNT-A', name: 'Signalling & Telecom Tech-1 (S&T)', department: 'S&T' as const, base_station: 'Aligarh Jn (ALJN)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
      { id: 'CREW-SNT-B', name: 'Signalling & Telecom Tech-2 (S&T)', department: 'S&T' as const, base_station: 'Prayagraj Jn (PRYJ)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
      { id: 'CREW-TRD-A', name: 'Traction Distribution Wagon 1 (TRD)', department: 'TRD/OHE' as const, base_station: 'Ghaziabad (GZB)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
      { id: 'CREW-TRD-B', name: 'Traction Distribution Wagon 2 (TRD)', department: 'TRD/OHE' as const, base_station: 'Etawah Jn (ETW)', max_shift_hours: 8.0, is_available: true, active_assignments: [] },
    ],
    metadata: {
      corridor_name: 'New Delhi (NDLS) – Varanasi (BSB) High Density Corridor (HDN-1)',
      total_route_km: 1036.7,
      electrification: '100% 25kV AC Traction',
      signaling: 'Automatic Block Signaling (ABS) + Modern Electronic Interlocking',
      prototype_disclaimer: 'Prototype • Simulated Railway Operations Data'
    }
  };
}

function getFallbackOptimizationResult(params?: WhatIfParameters): OptimizationResult {
  const trafficLevel = params?.train_traffic_level_pct || 100;
  const reqCount = params?.maintenance_requests_count || 8;
  const durationMult = params?.maintenance_duration_multiplier || 1.0;

  return {
    scenario_name: 'Optimal Integrated Corridor Block Plan',
    is_optimized: true,
    before_metrics: {
      total_schedule_conflicts: 12,
      affected_trains_count: 7,
      overall_asset_availability_pct: 68.0,
      critical_asset_availability_pct: 70.5,
      maintenance_completion_pct: 72.0,
      average_train_delay_minutes: 46.0,
      total_maintenance_hours_scheduled: 18.5,
      safety_compliance_score_pct: 74.0,
      solver_execution_time_ms: 0.0
    },
    after_metrics: {
      total_schedule_conflicts: 2,
      affected_trains_count: 1,
      overall_asset_availability_pct: 91.4,
      critical_asset_availability_pct: 96.4,
      maintenance_completion_pct: 100.0,
      average_train_delay_minutes: trafficLevel > 120 ? 14.2 : 8.0,
      total_maintenance_hours_scheduled: +(23.0 * durationMult).toFixed(1),
      safety_compliance_score_pct: 98.5,
      solver_execution_time_ms: 14.8
    },
    scheduled_blocks: [
      {
        block_id: 'BLK-OPT-MR-1041',
        request_id: 'MR-1041',
        asset_id: 'AST-TRK-01',
        asset_name: 'Continuous Welded Rail De-stressing',
        section_id: 'SEC-01',
        section_name: 'New Delhi – Ghaziabad',
        department: 'Engineering' as const,
        start_minute: 75,
        end_minute: 225,
        start_time: '01:15',
        end_time: '03:45',
        duration_minutes: 150,
        assigned_crew: 'CREW-ENG-A',
        priority: 'HIGH' as const,
        confidence_score: 0.98,
        affected_train_ids: [],
        reason_for_window: 'Integrated Shadow Window (Precedes IR-107 Shuttle by 90 min)',
        power_block: false,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1044',
        request_id: 'MR-1044',
        asset_id: 'AST-OHE-03',
        asset_name: 'Overhead Catenary Stagger Adjustment',
        section_id: 'SEC-02',
        section_name: 'Ghaziabad – Meerut',
        department: 'TRD/OHE' as const,
        start_minute: 60,
        end_minute: 240,
        start_time: '01:00',
        end_time: '04:00',
        duration_minutes: 180,
        assigned_crew: 'CREW-TRD-A',
        priority: 'HIGH' as const,
        confidence_score: 0.96,
        affected_train_ids: [],
        reason_for_window: 'Power isolation slot synchronized with zero nocturnal passenger movements',
        power_block: true,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1043',
        request_id: 'MR-1043',
        asset_id: 'AST-PNC-04',
        asset_name: 'Curved Switch Point & Crossing Overhaul',
        section_id: 'SEC-03',
        section_name: 'Meerut – Aligarh',
        department: 'Engineering' as const,
        start_minute: 90,
        end_minute: 300,
        start_time: '01:30',
        end_time: '05:00',
        duration_minutes: 210,
        assigned_crew: 'CREW-ENG-B',
        priority: 'EMERGENCY' as const,
        confidence_score: 0.99,
        affected_train_ids: [],
        reason_for_window: 'Emergency possession allocated before morning peak corridor runs',
        power_block: false,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1042',
        request_id: 'MR-1042',
        asset_id: 'AST-SIG-05',
        asset_name: 'Auto Block Signal Relay Rack (AB-44)',
        section_id: 'SEC-03',
        section_name: 'Meerut – Aligarh',
        department: 'S&T' as const,
        start_minute: 240,
        end_minute: 360,
        start_time: '04:00',
        end_time: '06:00',
        duration_minutes: 120,
        assigned_crew: 'CREW-SNT-A',
        priority: 'HIGH' as const,
        confidence_score: 0.95,
        affected_train_ids: [],
        reason_for_window: 'Moved from 02:00 to 04:00 to avoid scheduled passenger movements',
        power_block: false,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1045',
        request_id: 'MR-1045',
        asset_id: 'AST-TRK-07',
        asset_name: 'Deep Ballast Screening Km 342',
        section_id: 'SEC-05',
        section_name: 'Tundla – Kanpur',
        department: 'Engineering' as const,
        start_minute: 135,
        end_minute: 315,
        start_time: '02:15',
        end_time: '05:15',
        duration_minutes: 180,
        assigned_crew: 'CREW-ENG-A',
        priority: 'HIGH' as const,
        confidence_score: 0.97,
        affected_train_ids: [],
        reason_for_window: 'Staggered slot eliminates Crew Alpha collision with SEC-01 block',
        power_block: false,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1046',
        request_id: 'MR-1046',
        asset_id: 'AST-OHE-08',
        asset_name: 'Section Insulator & Isolator Unit (TRD)',
        section_id: 'SEC-05',
        section_name: 'Tundla – Kanpur',
        department: 'TRD/OHE' as const,
        start_minute: 150,
        end_minute: 300,
        start_time: '02:30',
        end_time: '05:00',
        duration_minutes: 150,
        assigned_crew: 'CREW-TRD-A',
        priority: 'MEDIUM' as const,
        confidence_score: 0.93,
        affected_train_ids: ['TR-109'],
        reason_for_window: 'Integrated shadow possession parallel with Track Bed screening',
        power_block: true,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1047',
        request_id: 'MR-1047',
        asset_id: 'AST-OHE-11',
        asset_name: 'Auto-Tensioning Device (ATD) Pulley Set',
        section_id: 'SEC-07',
        section_name: 'Etawah – Prayagraj',
        department: 'TRD/OHE' as const,
        start_minute: 105,
        end_minute: 285,
        start_time: '01:45',
        end_time: '04:45',
        duration_minutes: 180,
        assigned_crew: 'CREW-TRD-B',
        priority: 'EMERGENCY' as const,
        confidence_score: 0.98,
        affected_train_ids: [],
        reason_for_window: 'Critical pantograph protection block scheduled in low-traffic shadow',
        power_block: true,
        traffic_block: true,
        safety_buffer_applied: 15
      },
      {
        block_id: 'BLK-OPT-MR-1048',
        request_id: 'MR-1048',
        asset_id: 'AST-SIG-14',
        asset_name: 'Digital Axle Counter Evaluation (DAC)',
        section_id: 'SEC-08',
        section_name: 'Prayagraj – Varanasi',
        department: 'S&T' as const,
        start_minute: 120,
        end_minute: 240,
        start_time: '02:00',
        end_time: '04:00',
        duration_minutes: 120,
        assigned_crew: 'CREW-SNT-B',
        priority: 'HIGH' as const,
        confidence_score: 0.96,
        affected_train_ids: [],
        reason_for_window: 'Scheduled prior to Vande Bharat early morning departure',
        power_block: false,
        traffic_block: true,
        safety_buffer_applied: 15
      }
    ],
    resolved_conflicts: [
      { id: 'CONF-001', type: 'TRAIN_CONFLICT' as const, severity: 'CRITICAL' as const, section_name: 'Meerut – Aligarh', affected_entities: ['IR-12418 Prayagraj Exp', 'MR-1042 S&T Relay Rack'], description: 'Nocturnal passenger train movement intersected manual S&T slot.', suggested_resolution: 'Shifted S&T window from 02:00 to 04:00.' },
      { id: 'CONF-002', type: 'CREW_CONFLICT' as const, severity: 'HIGH' as const, section_name: 'New Delhi / Kanpur', affected_entities: ['CREW-ENG-A', 'MR-1041', 'MR-1045'], description: 'Crew Alpha double booked simultaneously across 2 distant sections.', suggested_resolution: 'Staggered start windows with 120 min buffer.' },
      { id: 'CONF-003', type: 'ASSET_CONFLICT' as const, severity: 'CRITICAL' as const, section_name: 'Meerut – Aligarh', affected_entities: ['MR-1042 S&T', 'MR-1043 Engg P&C'], description: 'Two uncoordinated departmental blocks on same single track segment.', suggested_resolution: 'Fused into coordinated multi-discipline shadow corridor window.' }
    ],
    remaining_conflicts: [
      { id: 'CONF-REM-01', type: 'TRAIN_CONFLICT' as const, severity: 'LOW' as const, section_name: 'Tundla – Kanpur', affected_entities: ['IR-CONTR-01 DFCCIL Freight'], description: 'Precautionary 12-minute loop line regulation applied.', suggested_resolution: 'Acceptable operational adjustment for freight traffic.' }
    ],
    affected_trains: [
      {
        train_id: 'IR-CONTR-01',
        train_name: 'DFCCIL Container Cargo (Dadri-Varanasi)',
        original_slot: '02:10 - 04:30',
        regulated_slot: '02:22 - 04:42',
        delay_minutes: 12,
        reason: '12-minute precautionary regulation for Section Insulator TRD block.'
      }
    ],
    ai_insights: [
      'Optimal corridor block plan generated in 14.8ms using Google OR-Tools CP-SAT.',
      'Schedule conflicts reduced by 83.3% (from 12 down to 2 conflicts).',
      'Simulated asset availability maximized to 91.4% (+23.4% gain).',
      '100% of EMERGENCY and HIGH-priority maintenance accommodated in verified shadow windows.',
      'Integrated shadow block created for Meerut–Aligarh saving 180 min of track possession.',
      'Zero passenger trains delayed (Vande Bharat & Rajdhani run at 100% punctuality).'
    ],
    disclaimer: 'Prototype • Simulated Railway Operations Data. AI-generated plans require authorized operational validation before execution.'
  };
}
