import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Check, Cpu, MonitorCog, Network, Shield } from "lucide-react";

export const Route = createFileRoute("/requirements")({
  head: () => ({
    meta: [
      { title: "Requirements — MarketSim" },
      { name: "description", content: "Functional, non-functional, software, and hardware requirements for the platform." },
    ],
  }),
  component: RequirementsPage,
});

const functional = [
  "Allow users to input market parameters such as pricing, demand levels, and competitor behavior",
  "Enable creation and execution of multiple simulation scenarios",
  "Model realistic market interactions using the simulation engine",
  "Integrate Machine Learning models for forecasting and analysis",
  "Generate outputs such as profit, demand trends, and market share",
  "Provide interactive dashboards for visualizing simulation results",
  "Support saving, loading, and comparing scenarios",
];

const nonFunctional = [
  "Scalability to handle simulations with hundreds of agents and many ticks",
  "Responsive UI that updates smoothly during long-running computations",
  "Reproducibility through deterministic seeded random number generation",
  "Portability across modern operating systems and browsers",
  "Maintainability through a modular component architecture",
];

const software = [
  "Frontend: React 19 + TanStack Start (TypeScript)",
  "Styling: Tailwind CSS v4 with semantic design tokens",
  "Charts: Recharts",
  "State: Zustand with localStorage persistence",
  "Simulation: In-browser agent-based engine (TypeScript)",
  "ML: Pure-TS linear regression, exponential smoothing, hybrid forecasting",
  "OS: Windows, Linux, or macOS (browser-based)",
];

const hardware = [
  "Minimum 8 GB RAM for smooth performance",
  "Multi-core processor for efficient computation",
  "Adequate storage for datasets and simulation results",
  "Stable internet connection for system access and updates",
  "Optional server / cloud infrastructure for shared deployment",
];

const other = [
  "Proper documentation for users and developers",
  "System portability across different platforms",
  "Scalability for future enhancements and features",
  "Extensibility to integrate additional data sources and models",
  "Ease of maintenance and upgrades",
];

function RequirementsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader eyebrow="Specification" title="Requirements" description="Complete functional, non-functional, software, hardware, and operational requirements as defined in the project synopsis." />
      <div className="grid md:grid-cols-2 gap-4">
        <ReqCard icon={Check} title="Functional Requirements" items={functional} />
        <ReqCard icon={Shield} title="Non-Functional Requirements" items={nonFunctional} />
        <ReqCard icon={MonitorCog} title="Software Requirements" items={software} />
        <ReqCard icon={Cpu} title="Hardware Requirements" items={hardware} />
        <ReqCard icon={Network} title="Other Requirements" items={other} className="md:col-span-2" />
      </div>
    </div>
  );
}

function ReqCard({ icon: Icon, title, items, className = "" }: { icon: any; title: string; items: string[]; className?: string }) {
  return (
    <Card className={`p-5 bg-card/60 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/90">
            <span className="text-primary font-mono shrink-0">▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
