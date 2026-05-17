import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Save, RotateCcw, TrendingUp, DollarSign, ShoppingCart, Trophy } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { defaultParams, runSimulation, type SimulationParams, type SimulationResult, type Strategy } from "@/lib/simulation/engine";
import { useScenarios } from "@/lib/store/scenarios";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Simulator — MarketSim" },
      { name: "description", content: "Run agent-based market simulations: tune pricing, demand, competitors, and marketing — visualize outcomes live." },
    ],
  }),
  component: SimulatorPage,
});

const CHART_COLORS = ["oklch(0.72 0.16 165)", "oklch(0.65 0.18 240)", "oklch(0.78 0.16 75)", "oklch(0.68 0.2 320)", "oklch(0.62 0.22 25)"];

function SimulatorPage() {
  const [params, setParams] = useState<SimulationParams>(defaultParams());
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const save = useScenarios((s) => s.save);

  const update = <K extends keyof SimulationParams>(k: K, v: SimulationParams[K]) =>
    setParams((p) => ({ ...p, [k]: v }));

  const updateFirm = (i: number, patch: Partial<SimulationParams["firms"][0]>) => {
    setParams((p) => ({
      ...p,
      firms: p.firms.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    }));
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      try {
        const r = runSimulation(params);
        setResult(r);
        toast.success("Simulation complete", { description: `${params.steps} ticks · winner: ${r.summary.winner}` });
      } catch (e) {
        toast.error("Simulation failed", { description: String(e) });
      } finally {
        setRunning(false);
      }
    }, 50);
  };

  const handleSave = () => {
    if (!result) return toast.error("Run a simulation first");
    const name = scenarioName.trim() || `Scenario ${new Date().toLocaleString()}`;
    save(name, params, result);
    setScenarioName("");
    toast.success("Scenario saved", { description: name });
  };

  const handleReset = () => { setParams(defaultParams()); setResult(null); };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.ticks.map((t) => {
      const row: Record<string, number> = { step: t.step, demand: Math.round(t.totalDemand) };
      params.firms.forEach((f, i) => {
        row[`${f.name}_price`] = Number(t.prices[i].toFixed(2));
        row[`${f.name}_share`] = Number((t.shares[i] * 100).toFixed(2));
        row[`${f.name}_profit`] = Math.round(t.profit[i]);
      });
      return row;
    });
  }, [result, params.firms]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Live Engine"
        title="Market Simulator"
        description="Configure market parameters and run the agent-based simulation. Consumer agents choose firms by utility; firms adapt prices based on their strategy."
      />

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Parameter panel */}
        <Card className="p-5 bg-card/60 h-fit lg:sticky lg:top-20">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Parameters
          </h2>

          <div className="space-y-5">
            <SliderField label="Base Price" value={params.basePrice} min={10} max={500} step={5}
              onChange={(v) => update("basePrice", v)} suffix="$" />
            <SliderField label="Initial Demand (units/tick)" value={params.initialDemand} min={100} max={5000} step={50}
              onChange={(v) => update("initialDemand", v)} />
            <SliderField label="Price Elasticity" value={params.priceElasticity} min={0.5} max={3} step={0.1}
              onChange={(v) => update("priceElasticity", v)} />
            <SliderField label="Consumer Agents" value={params.consumerAgents} min={50} max={2000} step={50}
              onChange={(v) => update("consumerAgents", v)} />
            <SliderField label="Marketing Spend" value={params.marketingSpend} min={0} max={100} step={1}
              onChange={(v) => update("marketingSpend", v)} suffix="%" />
            <SliderField label="Competitor Aggressiveness" value={params.competitorAggressiveness} min={0} max={1} step={0.05}
              onChange={(v) => update("competitorAggressiveness", v)} />
            <SliderField label="Market Volatility" value={params.noise} min={0} max={0.5} step={0.01}
              onChange={(v) => update("noise", v)} />
            <SliderField label="Simulation Steps" value={params.steps} min={20} max={500} step={10}
              onChange={(v) => update("steps", v)} />

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Random Seed</Label>
              <Input type="number" value={params.seed} onChange={(e) => update("seed", Number(e.target.value))}
                className="mt-2 font-mono" />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Competing Firms</Label>
              <div className="space-y-2">
                {params.firms.map((f, i) => (
                  <div key={i} className="grid grid-cols-[1fr_110px_80px] gap-2">
                    <Input value={f.name} onChange={(e) => updateFirm(i, { name: e.target.value })} className="h-9 text-sm" />
                    <Select value={f.strategy} onValueChange={(v) => updateFirm(i, { strategy: v as Strategy })}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" value={f.initialPrice}
                      onChange={(e) => updateFirm(i, { initialPrice: Number(e.target.value) })}
                      className="h-9 text-sm font-mono" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={handleRun} disabled={running} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {running ? "Running…" : <><Play className="h-4 w-4 mr-2" /> Run Simulation</>}
            </Button>
            <div className="flex gap-2">
              <Input placeholder="Scenario name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="h-9 text-sm" />
              <Button variant="outline" onClick={handleSave} disabled={!result} className="shrink-0">
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" onClick={handleReset} className="text-xs">
              <RotateCcw className="h-3 w-3 mr-1" /> Reset to defaults
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-5 min-w-0">
          {!result ? (
            <Card className="p-12 bg-card/40 border-dashed text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Play className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Configure parameters and run a simulation</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                The agent-based engine will execute {params.steps} ticks with {params.firms.length} firms competing for {params.initialDemand} units of demand per tick.
              </p>
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KpiCard label="Winner" value={result.summary.winner} icon={Trophy} trend="up" />
                <KpiCard
                  label="Total Profit"
                  value={`$${Math.round(result.summary.finalProfit.reduce((a, b) => a + b, 0)).toLocaleString()}`}
                  icon={DollarSign}
                />
                <KpiCard
                  label="Avg Demand"
                  value={Math.round(result.ticks.reduce((s, t) => s + t.totalDemand, 0) / result.ticks.length).toLocaleString()}
                  icon={ShoppingCart}
                />
                <KpiCard
                  label="Ticks Executed"
                  value={result.ticks.length.toString()}
                  delta={`seed ${params.seed}`}
                />
              </div>

              {/* Firm summary table */}
              <Card className="p-5 bg-card/60">
                <h3 className="font-display font-semibold mb-3">Firm Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="text-left py-2 px-2">Firm</th>
                        <th className="text-left py-2 px-2">Strategy</th>
                        <th className="text-right py-2 px-2">Avg Price</th>
                        <th className="text-right py-2 px-2">Avg Share</th>
                        <th className="text-right py-2 px-2">Volatility</th>
                        <th className="text-right py-2 px-2">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {params.firms.map((f, i) => (
                        <tr key={i} className="border-b border-border/40">
                          <td className="py-2 px-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                            {f.name}
                          </td>
                          <td className="py-2 px-2"><Badge variant="secondary" className="text-[10px]">{f.strategy}</Badge></td>
                          <td className="py-2 px-2 text-right">${result.summary.avgPrice[i].toFixed(2)}</td>
                          <td className="py-2 px-2 text-right">{(result.summary.avgShare[i] * 100).toFixed(1)}%</td>
                          <td className="py-2 px-2 text-right text-muted-foreground">{result.summary.volatility[i].toFixed(2)}</td>
                          <td className="py-2 px-2 text-right text-success">${Math.round(result.summary.finalProfit[i]).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Charts */}
              <Tabs defaultValue="price">
                <TabsList>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="share">Market Share</TabsTrigger>
                  <TabsTrigger value="profit">Profit</TabsTrigger>
                  <TabsTrigger value="demand">Demand</TabsTrigger>
                </TabsList>
                <TabsContent value="price">
                  <ChartCard title="Price over time">
                    <LineChart data={chartData}>
                      {commonAxes()}
                      {params.firms.map((f, i) => (
                        <Line key={f.name} type="monotone" dataKey={`${f.name}_price`} name={f.name}
                          stroke={CHART_COLORS[i]} strokeWidth={2} dot={false} />
                      ))}
                    </LineChart>
                  </ChartCard>
                </TabsContent>
                <TabsContent value="share">
                  <ChartCard title="Market share (%)">
                    <AreaChart data={chartData} stackOffset="expand">
                      {commonAxes()}
                      {params.firms.map((f, i) => (
                        <Area key={f.name} type="monotone" dataKey={`${f.name}_share`} name={f.name}
                          stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.5} />
                      ))}
                    </AreaChart>
                  </ChartCard>
                </TabsContent>
                <TabsContent value="profit">
                  <ChartCard title="Cumulative profit ($)">
                    <LineChart data={chartData}>
                      {commonAxes()}
                      {params.firms.map((f, i) => (
                        <Line key={f.name} type="monotone" dataKey={`${f.name}_profit`} name={f.name}
                          stroke={CHART_COLORS[i]} strokeWidth={2} dot={false} />
                      ))}
                    </LineChart>
                  </ChartCard>
                </TabsContent>
                <TabsContent value="demand">
                  <ChartCard title="Total market demand">
                    <AreaChart data={chartData}>
                      {commonAxes()}
                      <Area type="monotone" dataKey="demand" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.25} />
                    </AreaChart>
                  </ChartCard>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function commonAxes() {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 250 / 0.4)" />
      <XAxis dataKey="step" stroke="oklch(0.72 0.02 250)" fontSize={11} />
      <YAxis stroke="oklch(0.72 0.02 250)" fontSize={11} />
      <Tooltip contentStyle={{ background: "oklch(0.22 0.035 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card className="p-5 bg-card/60 mt-3">
      <h3 className="font-display font-semibold text-sm mb-3">{title}</h3>
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </Card>
  );
}

function SliderField({
  label, value, min, max, step, onChange, suffix,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
        <span className="text-xs font-mono text-foreground">{suffix === "$" ? `$${value}` : `${value}${suffix ?? ""}`}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}
