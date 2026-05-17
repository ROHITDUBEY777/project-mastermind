import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart, ReferenceLine,
} from "recharts";
import { BrainCircuit, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScenarios } from "@/lib/store/scenarios";
import { forecast } from "@/lib/ml/forecast";
import { KpiCard } from "@/components/kpi-card";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "ML Forecast — MarketSim" },
      { name: "description", content: "Forecast demand using linear regression, exponential smoothing, and hybrid models. Inspect RMSE, MAE, and R²." },
    ],
  }),
  component: ForecastPage,
});

type Method = "linear" | "exp_smoothing" | "hybrid";

function ForecastPage() {
  const scenarios = useScenarios((s) => s.scenarios);
  const [selectedId, setSelectedId] = useState<string>(scenarios[0]?.id ?? "");
  const [horizon, setHorizon] = useState(30);
  const [method, setMethod] = useState<Method>("hybrid");
  const [target, setTarget] = useState<"demand" | "firm0_profit">("demand");

  const scenario = scenarios.find((s) => s.id === selectedId);

  const history = useMemo<number[]>(() => {
    if (!scenario) return [];
    if (target === "demand") return scenario.result.ticks.map((t) => t.totalDemand);
    return scenario.result.ticks.map((t) => t.profit[0] || 0);
  }, [scenario, target]);

  const result = useMemo(() => {
    if (history.length < 4) return null;
    return forecast(history, horizon, method);
  }, [history, horizon, method]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Predictive Analytics"
        title="Machine Learning Forecast"
        description="Apply regression and time-series forecasting to scenario outputs. The hybrid model blends linear trend with exponential smoothing."
      />

      {scenarios.length === 0 ? (
        <Card className="p-12 bg-card/40 border-dashed text-center">
          <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-display font-semibold">No scenarios available</h3>
          <p className="text-sm text-muted-foreground mt-2">Run and save a simulation first, then return here to forecast.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <Card className="p-5 bg-card/60 h-fit space-y-5 lg:sticky lg:top-20">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Configuration
            </h2>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scenario</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target Series</Label>
              <Select value={target} onValueChange={(v) => setTarget(v as any)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand">Total Demand</SelectItem>
                  <SelectItem value="firm0_profit">Firm A Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Model</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="exp_smoothing">Exponential Smoothing</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Forecast Horizon</Label>
                <span className="text-xs font-mono">{horizon} steps</span>
              </div>
              <Slider value={[horizon]} min={5} max={100} step={5} onValueChange={(v) => setHorizon(v[0])} />
            </div>
          </Card>

          <div className="space-y-5 min-w-0">
            {result && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KpiCard label="R² (in-sample)" value={result.metrics.r2.toFixed(3)} trend={result.metrics.r2 > 0.7 ? "up" : "neutral"} />
                  <KpiCard label="RMSE" value={result.metrics.rmse.toFixed(2)} />
                  <KpiCard label="MAE" value={result.metrics.mae.toFixed(2)} />
                  <KpiCard label="Trend Slope" value={result.slope.toFixed(3)} trend={result.slope > 0 ? "up" : "down"} />
                </div>

                <Card className="p-5 bg-card/60">
                  <h3 className="font-display font-semibold text-sm mb-3">
                    Actual vs Predicted · {horizon}-step forecast
                  </h3>
                  <div className="h-[420px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={result.series}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 250 / 0.4)" />
                        <XAxis dataKey="step" stroke="oklch(0.72 0.02 250)" fontSize={11} />
                        <YAxis stroke="oklch(0.72 0.02 250)" fontSize={11} />
                        <Tooltip contentStyle={{ background: "oklch(0.22 0.035 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <ReferenceLine x={history.length - 1} stroke="oklch(0.78 0.16 75)" strokeDasharray="4 4" label={{ value: "Forecast →", fill: "oklch(0.78 0.16 75)", fontSize: 11 }} />
                        <Area type="monotone" dataKey="upper" stroke="none" fill="oklch(0.65 0.18 240)" fillOpacity={0.12} />
                        <Area type="monotone" dataKey="lower" stroke="none" fill="oklch(0.18 0.03 250)" fillOpacity={1} />
                        <Line type="monotone" dataKey="actual" name="Actual" stroke="oklch(0.72 0.16 165)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="predicted" name="Predicted" stroke="oklch(0.65 0.18 240)" strokeWidth={2} dot={false} strokeDasharray="0" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Shaded band shows the 95% prediction interval. The solid emerald line is the historical series from your selected scenario; the blue line is the model's prediction extending {horizon} steps beyond the last observed tick.
                  </p>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
