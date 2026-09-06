# RailOpt AI — Intelligent Railway Block Planning & Asset Availability Platform

### Smart India Hackathon (SIH) Prototype • Problem Statement PS 26027
**AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways**

---

> [!IMPORTANT]
> **Operational Positioning & Safety Standard:**
> RailOpt AI operates as an intelligent advisory decision-support layer designed to assist Section Controllers and Divisional Block Planners. AI-generated block proposals strictly require authorized validation prior to field execution. All presented numbers represent simulated Northern/North-Central Railway HDN-1 corridor operational data (New Delhi to Varanasi).

---

## 🚀 Key Value Proposition

RailOpt AI automates and optimizes railway maintenance block planning across multi-discipline assets (Civil Engineering Track, Signaling & Telecom, 25kV Traction OHE) to:

$$\text{MAXIMIZE ASSET AVAILABILITY} + \text{MINIMIZE TRAIN DISRUPTION} + \text{EXECUTE CRITICAL MAINTENANCE} + \text{AVOID CREW/SAFETY CONFLICTS}$$

### 📊 Before vs After AI Optimization (Simulated HDN-1 Corridor Benchmark)

| Operational Metric | Manual / Uncoordinated Schedule | RailOpt AI (OR-Tools CP-SAT) | Realized Improvement |
| :--- | :---: | :---: | :---: |
| **Schedule Conflicts** | **12 conflicts** | **2 residual conflicts** | **-83.3% Conflict Drop** |
| **Affected Train Movements** | **7 trains delayed** | **1 freight regulated** | **Zero Passenger Delays** |
| **Corridor Asset Availability** | **68.0%** | **91.4%** | **+23.4% Availability Gain** |
| **Critical Maintenance Completed** | **72.0%** | **100.0%** | **100% Emergency & High P1** |
| **Average Train Delay** | **46.0 min** | **8.0 min** | **-38.0 min Average Delay** |
| **Solver Execution Latency** | *Hours of manual negotiation* | **14.8 milliseconds** | **Instantaneous Decision Support** |

---

## 🔄 10-Step End-to-End Operational Pipeline

```
TRAIN + ASSET DATA  ──▶  MAINTENANCE REQUESTS  ──▶  ASSET PRIORITIZATION  ──▶  AVAILABLE TIME WINDOWS
         │
         ▼
AI BLOCK PLAN GENERATION  ──▶  CONFLICT & SAFETY CHECK  ──▶  OR-TOOLS CP-SAT OPTIMIZATION
         │
         ▼
OPTIMIZED BLOCK PLAN  ──▶  OPERATIONS & AVAILABILITY  ──▶  LIVE CONTROL CENTER DASHBOARD
```

---

## 🛠️ System Architecture

- **Backend Optimization Core:**
  - **Python FastAPI:** High-performance RESTful API endpoints.
  - **Google OR-Tools (CP-SAT 9.15):** Mixed-integer constraint satisfaction solver evaluating non-overlapping track intervals, crew double-booking restrictions, and time-space corridor separation.
  - **AI Risk & Urgency Engine:** Composite mathematical scoring model synthesizing track tonnage (GMT loading), ultrasonic flaw records (USFD), catenary wear logs, and operational impact.
  - **Dynamic Disruption Re-planner:** Real-time handler that auto-reschedules downstream blocks when live work overruns occur (+90 min).

- **Frontend Control Center:**
  - **React 18 + TypeScript + Vite:** Ultra-fast, type-safe interface.
  - **Tailwind CSS:** Professional dark/navy railway control room aesthetics.
  - **Interactive 2.5D Corridor Visualizer:** SVG/Canvas time-space model representing the New Delhi – Varanasi corridor with moving train telemetry.
  - **Interactive Gantt Timeline:** Real-time possession slots vs passenger train paths.
  - **Recharts Analytics:** Comparative Before vs After performance visualizations.

---

## ⚡ Quick Start & Run Instructions

### 1. Start Python FastAPI Backend
```bash
cd backend
py -m pip install -r requirements.txt
py run.py
```
*The backend API will start at `http://127.0.0.1:8000`.*
*Interactive Swagger docs available at `http://127.0.0.1:8000/docs`.*

### 2. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🎙️ 3-Minute Hackathon Demo Script for Judges

1. **Dashboard (0:00 - 0:30):**
   - Highlight the 6 KPI cards (20 Trains, 10 Track Sections, 15 Monitored Assets, 8 Block Requests, 91.4% Asset Availability).
   - Point out the New Delhi – Varanasi 2.5D Corridor Map with active train movements and track possession highlights.
   - Click any track section (e.g. *Meerut – Aligarh*) to show real-time track specifications and health scores.

2. **Track Assets & AI Risk Model (0:30 - 1:00):**
   - Navigate to **Track & Assets**.
   - Show the 5 asset types (Track, Signal, OHE, Point & Crossing, Bridge).
   - Select *AST-PNC-04 (Curved Switch Point & Crossing)* to demonstrate the transparent AI Risk Formula (Risk Score: 89.4/100, GMT tonnage penalty, flaw urgency).

3. **AI Block Planner (1:00 - 1:45):**
   - Click **AI Block Planner** (The core solver cockpit).
   - Review the 6 input vectors on the left.
   - Click **GENERATE OPTIMAL BLOCK PLAN** to watch the 5-stage CP-SAT solver animation execute in real time (~15ms).
   - Point out the AI Recommendation: *"Shift Meerut–Aligarh S&T maintenance from 02:00 to 04:00 to avoid Prayagraj Express"*.

4. **Before vs After Analytics (1:45 - 2:15):**
   - Navigate to **Optimization Results**.
   - Review the Before vs After comparison (Conflicts: 12 → 2, Delay: 46m → 8m, Availability: 68% → 91.4%).
   - Show the resolved conflicts ledger.

5. **What-If Simulation & Dynamic Disruption (2:15 - 3:00):**
   - Open **What-If Simulator**.
   - Select *Scenario B (High Traffic Surge)* or drag the traffic slider to 150%.
   - Click **Run What-If Simulation** to show instant constraint re-computation.
   - Click **Simulate +90m Live Overrun Disruption** to demonstrate dynamic real-time slot shifting without delaying Vande Bharat or Rajdhani services!
