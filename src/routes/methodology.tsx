import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Database, Cpu, BrainCircuit, BarChart3, Layout, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — MarketSim" },
      { name: "description", content: "Modular architecture combining simulation modeling, predictive analytics, and interactive visualization." },
    ],
  }),
  component: MethodologyPage,
});

const modules = [
  { icon: Database, title: "Data Layer", color: "from-blue-500/20 to-blue-500/0", text: "Historical and synthetic market data; scenario inputs persisted to structured storage." },
  { icon: Cpu, title: "Simulation Engine", color: "from-emerald-500/20 to-emerald-500/0", text: "Agent-based model of consumers and firms producing emergent price, demand, and share dynamics." },
  { icon: BrainCircuit, title: "ML / Analytics", color: "from-violet-500/20 to-violet-500/0", text: "Regression and time-series forecasting for demand prediction with confidence intervals." },
  { icon: BarChart3, title: "Visualization", color: "from-amber-500/20 to-amber-500/0", text: "Interactive dashboards: KPI cards, line/area charts, share breakdowns, scenario comparison." },
  { icon: Layout, title: "User Interface", color: "from-pink-500/20 to-pink-500/0", text: "Responsive React UI with parameter controls, scenario manager, and exportable reports." },
];

function MethodologyPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="System Design"
        title="Proposed Methodology"
        description="A modular architecture integrating simulation modeling, predictive analytics, and interactive visualization for scalable, efficient, easy-to-use market experimentation."
      />

      {/* Architecture diagram */}
      <Card className="p-8 bg-card/50 mb-10 overflow-x-auto">
        <div className="min-w-[720px] flex items-center justify-between gap-3">
          {modules.map((m, i) => (
            <div key={m.title} className="flex items-center gap-3 flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`h-16 w-16 rounded-xl bg-gradient-to-b ${m.color} border border-border flex items-center justify-center mb-2`}>
                  <m.icon className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-xs font-display font-semibold">{m.title}</div>
              </div>
              {i < modules.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {modules.map((m) => (
          <Card key={m.title} className="p-5 bg-card/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <m.icon className="h-4 w-4" />
              </div>
              <h3 className="font-display font-semibold">{m.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{m.text}</p>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold">Workflow</h2>
        <Card className="p-6 bg-card/60 text-sm text-foreground/90 leading-relaxed space-y-3">
          <p><span className="font-semibold text-primary">1. Input.</span> Users define base price, demand, elasticity, marketing spend, and competitor strategies.</p>
          <p><span className="font-semibold text-primary">2. Simulate.</span> The engine runs autonomous agents over N ticks; consumers select firms using utility functions, firms adapt prices.</p>
          <p><span className="font-semibold text-primary">3. Predict.</span> ML models forecast future demand using linear regression and exponential smoothing on simulation outputs.</p>
          <p><span className="font-semibold text-primary">4. Visualize.</span> Results are streamed to dashboards: price curves, market share, cumulative profit, and forecast bands.</p>
          <p><span className="font-semibold text-primary">5. Compare.</span> Scenarios are saved and benchmarked side-by-side to identify the most effective strategy.</p>
        </Card>
      </section>
    </div>
  );
}
