import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Package, Target } from "lucide-react";

export const Route = createFileRoute("/deliverables")({
  head: () => ({
    meta: [
      { title: "Deliverables — MarketSim" },
      { name: "description", content: "Project deliverables and use cases for the Market Simulation & Strategy Testing Platform." },
    ],
  }),
  component: DeliverablesPage,
});

const deliverables = [
  "A fully functional Market Simulation & Strategy Testing Platform with an interactive user interface",
  "A simulation engine capable of modeling realistic market behavior and strategy outcomes",
  "Integration of Machine Learning models for demand forecasting and decision support",
  "A structured database / persistent storage of historical data, simulation inputs, and generated results",
  "Interactive dashboards for KPI tracking, scenario comparison, and visual interpretation",
  "Project documentation, user guide, and technical report",
];

const useCases = [
  { t: "Market Analysis", d: "Analysts can study trends, demand patterns, and competitor behavior." },
  { t: "Decision Support", d: "Organizations can use insights from simulations to make data-driven decisions." },
  { t: "Scenario Analysis", d: "Users can perform \"what-if\" analysis by changing variables and observing outcomes." },
  { t: "Performance Evaluation", d: "Compare multiple strategies to identify the most effective approach." },
  { t: "Forecasting", d: "Predict future trends and outcomes using integrated AI-based models." },
  { t: "Educational Use", d: "Students and educators can explore agent-based modeling and ML concepts hands-on." },
];

function DeliverablesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader eyebrow="Outputs" title="Deliverables & Use Cases" description="What the project delivers, and the practical scenarios it supports." />

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold">Deliverables</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {deliverables.map((d, i) => (
            <Card key={i} className="p-4 bg-card/60 flex gap-3">
              <div className="font-mono text-primary text-xs shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-sm text-foreground/90">{d}</div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold">Use Cases</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {useCases.map((u) => (
            <Card key={u.t} className="p-5 bg-card/60 hover:border-primary/40 transition-colors">
              <h3 className="font-display font-semibold text-base mb-2">{u.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{u.d}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
