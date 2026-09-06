from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import json

from app.models import (
    TrackSection, Asset, MaintenanceRequest, Train, Crew,
    OptimizationResult, WhatIfParameters, DisruptionPayload
)
from app.data_store import (
    get_initial_sections, get_initial_assets, get_initial_requests,
    get_initial_trains, get_initial_crews
)
from app.risk_engine import calculate_asset_priority_score, prioritize_requests
from app.conflict_engine import detect_conflicts
from app.optimizer import solve_block_optimization_cp_sat, generate_unoptimized_baseline_blocks
from app.whatif_engine import get_preset_scenario_params, handle_dynamic_disruption
from app.reporter import generate_csv_report, get_system_references

app = FastAPI(
    title="RailOpt AI API",
    description="AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways (PS 26027)",
    version="1.0.0"
)

# CORS middleware for seamless frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for prototype session
data_db = {
    "sections": get_initial_sections(),
    "assets": get_initial_assets(),
    "requests": get_initial_requests(),
    "trains": get_initial_trains(),
    "crews": get_initial_crews(),
    "latest_result": None
}

# Enrich assets with AI risk scores on boot
for asset in data_db["assets"]:
    risk_info = calculate_asset_priority_score(asset)
    asset.risk_score = risk_info["risk_score"]

@app.get("/")
def root():
    return {
        "system": "RailOpt AI Decision-Support Platform",
        "problem_statement": "PS 26027 - AI-Powered Automatic Block Planning to Maximize Asset Availability",
        "corridor": "Northern / North-Central Railway (New Delhi – Varanasi)",
        "status": "OPERATIONAL",
        "optimization_engine": "Google OR-Tools CP-SAT + AI Risk Prioritization",
        "disclaimer": "Prototype • Simulated Railway Operations Data. AI-generated plans require authorized operational validation before execution."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "RailOpt AI Engine", "version": "1.0.0"}

@app.get("/api/data")
def get_all_data():
    """
    Returns the comprehensive simulated railway operations dataset.
    """
    # Recalculate AI priority scores
    for asset in data_db["assets"]:
        risk_info = calculate_asset_priority_score(asset)
        asset.risk_score = risk_info["risk_score"]

    assets_dict = {a.id: a for a in data_db["assets"]}
    prioritized_reqs = prioritize_requests(data_db["requests"], assets_dict)

    return {
        "sections": data_db["sections"],
        "assets": data_db["assets"],
        "requests": prioritized_reqs,
        "trains": data_db["trains"],
        "crews": data_db["crews"],
        "metadata": {
            "corridor_name": "New Delhi (NDLS) – Varanasi (BSB) High Density Corridor (HDN-1)",
            "total_route_km": 1036.7,
            "electrification": "100% 25kV AC Traction",
            "signaling": "Automatic Block Signaling (ABS) + Modern Electronic Interlocking",
            "prototype_disclaimer": "Prototype • Simulated Railway Operations Data"
        }
    }

@app.post("/api/optimize", response_model=OptimizationResult)
def run_optimization(params: Optional[WhatIfParameters] = None):
    """
    Executes the constraint-based CP-SAT solver and multi-objective optimization.
    """
    if params is None:
        params = WhatIfParameters()

    result = solve_block_optimization_cp_sat(
        sections=data_db["sections"],
        assets=data_db["assets"],
        requests=data_db["requests"],
        trains=data_db["trains"],
        crews=data_db["crews"],
        params=params
    )
    data_db["latest_result"] = result
    return result

@app.post("/api/simulate")
def run_what_if_simulation(params: WhatIfParameters):
    """
    Simulates dynamic scenarios (Preset A-E or custom parametric inputs).
    """
    if params.scenario_preset:
        preset_params = get_preset_scenario_params(params.scenario_preset)
        # Merge any overridden sliders
        if params.train_traffic_level_pct != 100:
            preset_params.train_traffic_level_pct = params.train_traffic_level_pct
        if params.maintenance_requests_count != 8:
            preset_params.maintenance_requests_count = params.maintenance_requests_count
        params = preset_params

    result = solve_block_optimization_cp_sat(
        sections=data_db["sections"],
        assets=data_db["assets"],
        requests=data_db["requests"],
        trains=data_db["trains"],
        crews=data_db["crews"],
        params=params
    )
    data_db["latest_result"] = result
    return {
        "scenario_parameters": params,
        "result": result
    }

@app.post("/api/replan")
def handle_disruption_replan(payload: DisruptionPayload):
    """
    Handles dynamic block overruns (e.g., +90 min delay) and triggers real-time schedule re-optimization.
    """
    if data_db["latest_result"] is None:
        data_db["latest_result"] = solve_block_optimization_cp_sat(
            sections=data_db["sections"],
            assets=data_db["assets"],
            requests=data_db["requests"],
            trains=data_db["trains"],
            crews=data_db["crews"]
        )

    response_data = handle_dynamic_disruption(
        payload=payload,
        current_result=data_db["latest_result"],
        sections=data_db["sections"],
        assets=data_db["assets"],
        requests=data_db["requests"],
        trains=data_db["trains"],
        crews=data_db["crews"]
    )
    return response_data

@app.post("/api/requests")
def add_maintenance_request(request: MaintenanceRequest):
    """
    Adds a new maintenance request to the system.
    """
    data_db["requests"].append(request)
    return {"message": "Maintenance request submitted successfully", "request": request}

@app.get("/api/export-report")
def export_report(format: str = Query("csv", enum=["csv", "json"])):
    """
    Generates and exports operational report.
    """
    if data_db["latest_result"] is None:
        data_db["latest_result"] = solve_block_optimization_cp_sat(
            sections=data_db["sections"],
            assets=data_db["assets"],
            requests=data_db["requests"],
            trains=data_db["trains"],
            crews=data_db["crews"]
        )

    if format == "csv":
        csv_content = generate_csv_report(data_db["latest_result"])
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=RailOpt_AI_Optimization_Report.csv"}
        )
    else:
        return data_db["latest_result"]

@app.get("/api/references")
def get_references():
    return {
        "references": get_system_references(),
        "disclaimer": "RailOpt AI operates as an intelligent decision-support advisory platform integrating with existing railway management paradigms."
    }
