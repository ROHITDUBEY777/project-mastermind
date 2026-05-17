
# Market Simulation & Strategy Testing Platform

A professional final-year project implementation of the synopsis: an interactive platform where users configure market parameters, run agent-based simulations, apply ML-style forecasting, and compare strategies through dashboards.

## Design Direction
- **Style**: Professional fintech / Bloomberg-terminal inspired — dark navy + crisp white surfaces, emerald (gains) / amber (warnings) / red (losses) accents, monospaced numerics.
- **Typography**: Space Grotesk (headings) + Inter (body) + JetBrains Mono (data/numbers).
- **Feel**: Dense, data-rich, but clean. Smooth Framer Motion transitions, animated charts, hover tooltips.

## Pages (separate routes)
1. **/** — Landing: project title, abstract summary, team (Shaikh Faris, Rohit Dubey, Ritvik Kowshik, Satwick — AIT, Group 19), guide (Mrs. Shrutika C R), CTAs into the app.
2. **/about** — Abstract, Introduction, Literature Survey (5 entries), Objectives.
3. **/methodology** — Proposed methodology + system architecture diagram (modular: Data → Simulation Engine → ML → Visualization).
4. **/simulator** — **Core interactive tool**:
   - Parameter panel: base price, price elasticity, initial demand, # of consumer agents, # of competitor firms, competitor aggressiveness, marketing spend, simulation steps (e.g. 100 ticks).
   - "Run Simulation" → executes agent-based model in-browser (Web Worker for responsiveness).
   - Live charts (Recharts): price over time, demand over time, market share (stacked area), cumulative profit per firm.
   - Save scenario (localStorage).
5. **/scenarios** — List saved scenarios; multi-select to compare side-by-side (profit, avg market share, volatility).
6. **/forecast** — ML forecasting view: pick a saved scenario's demand series, apply linear regression + moving-average / simple Holt-Winters forecast for next N steps; show actual vs predicted with confidence band and metrics (RMSE, MAE, R²).
7. **/requirements** — Functional, non-functional, software, hardware requirements (from PDF §5).
8. **/deliverables** — Deliverables + use cases (§6).
9. **/timeline** — Interactive Gantt chart (§7) rendered from the PDF table.
10. **/references** — References list (§8).

Shared sidebar navigation (collapsible) + top header with project title and group info.

## Technical Details

**Simulation engine** (`src/lib/simulation/`):
- Agent-based model: `ConsumerAgent` (willingness-to-pay, price sensitivity), `FirmAgent` (price, inventory, strategy: aggressive/balanced/premium).
- Each tick: firms set prices → consumers choose firm by utility (price + noise) → compute demand, revenue, profit, market share → firms adapt prices via simple reinforcement rule.
- Deterministic with seedable RNG (mulberry32) so runs are reproducible.
- Runs in a Web Worker to keep UI responsive; progress streamed back.

**ML / forecasting** (`src/lib/ml/`):
- Pure-TS implementations: linear regression (closed-form), moving average, exponential smoothing, simple time-series forecast.
- Metrics: RMSE, MAE, R².

**State & storage**:
- Zustand for app state; scenarios persisted in localStorage (no backend needed for v1). Architecture leaves room to wire Lovable Cloud later if needed.

**Charts**: Recharts (line, area, stacked bar, scatter for actual vs predicted).

**Animation**: Framer Motion for page transitions, KPI counters, chart reveals.

## File Structure
```text
src/
  routes/
    __root.tsx              (sidebar layout + header)
    index.tsx               (landing)
    about.tsx
    methodology.tsx
    simulator.tsx
    scenarios.tsx
    forecast.tsx
    requirements.tsx
    deliverables.tsx
    timeline.tsx
    references.tsx
  components/
    app-sidebar.tsx
    kpi-card.tsx
    parameter-panel.tsx
    simulation-charts.tsx
    gantt-chart.tsx
    architecture-diagram.tsx
  lib/
    simulation/
      engine.ts
      agents.ts
      worker.ts
    ml/
      regression.ts
      forecast.ts
      metrics.ts
    store/
      scenarios.ts          (zustand + localStorage)
  styles.css                (dark navy + emerald token theme)
```

## Out of scope (v1)
- MySQL / Node backend (replaced with in-browser engine + localStorage — same UX, no infra). Can add Lovable Cloud later for multi-user persistence.
- Python/Scikit-learn (re-implemented in TypeScript so it runs live in the browser).

Approve and I'll build it end-to-end.
