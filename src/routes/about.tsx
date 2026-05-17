import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MarketSim" },
      { name: "description", content: "Abstract, introduction, literature survey, and objectives for the Market Simulation & Strategy Testing Platform." },
    ],
  }),
  component: AboutPage,
});

const literature = [
  { title: "AI in Market Forecasting (2024)", body: "Surveys ML-driven demand and price forecasting techniques across dynamic markets, highlighting accuracy gains over classical statistical models." },
  { title: "Computational Economics & Simulation (2023)", body: "Reviews simulation frameworks that combine economic theory with computational modeling to study emergent market behavior." },
  { title: "Predictive Analytics in Business Strategy (2024)", body: "Examines integration of predictive models into strategic decision pipelines and the role of interactive dashboards." },
  { title: "Agent-Based Market Simulation (2023)", body: "Demonstrates how autonomous consumer and firm agents reproduce price fluctuations, demand variability, and competitive responses with greater flexibility than aggregate models." },
  { title: "Interactive Decision Support Systems (2022–2023)", body: "Modern DSS combine predictive analytics with visualization to make complex simulation results interpretable and actionable." },
];

const objectives = [
  "Design an agent-based simulation engine that models autonomous consumer and firm behavior.",
  "Integrate machine learning techniques (regression, time-series forecasting) for adaptive prediction.",
  "Enable scenario creation, parameter tuning, and risk-free strategy experimentation.",
  "Provide an interactive visualization layer with dashboards, KPIs, and comparison views.",
  "Deliver a lightweight, scalable, and user-friendly platform accessible to students, startups, and analysts.",
];

export default function AboutPage() { return <Inner />; }

function Inner() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader eyebrow="Project Synopsis" title="About the Project" description="A data-driven, ML-integrated platform that replicates real-world market environments and enables risk-free strategy testing." />

      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold">Abstract</h2>
        <Card className="p-6 bg-card/60 leading-relaxed text-sm text-foreground/90 space-y-4">
          <p>
            The Market Simulation and Strategy Testing Platform is designed as an intelligent, data-driven system that
            replicates real-world market environments and enables users to evaluate business strategies in a controlled
            and risk-free setting. Modern organizations operate under uncertainty, rapid change, and intense competition.
            Market behavior is influenced by interconnected factors such as demand fluctuations, pricing dynamics, and
            competitor actions. Traditional approaches based on historical data or limited experimentation cannot capture
            this complexity, motivating advanced simulation systems that support data-driven decisions.
          </p>
          <p>
            The system adopts a modular approach combining data processing, simulation modeling, predictive analytics, and
            visualization. The simulation engine uses agent-based modeling to represent market participants as autonomous
            entities. Machine learning (regression, time-series forecasting) enhances predictive accuracy. Users adjust
            parameters to evaluate outcomes on profitability and market share, and an interactive visualization layer
            presents results through intuitive dashboards.
          </p>
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-display font-semibold">Introduction</h2>
        <Card className="p-6 bg-card/60 leading-relaxed text-sm text-foreground/90 space-y-4">
          <p>
            In today's rapidly evolving business ecosystem, decision-making is increasingly driven by data and predictive
            insights. Testing strategies in real-world environments is constrained by cost, financial risk, and time.
            Market simulation systems provide virtual environments that replicate real-world economic conditions and let
            users experiment safely.
          </p>
          <p>
            Recent advancements in Artificial Intelligence, Machine Learning, and agent-based modeling have transformed
            simulation platforms from static analytical tools into dynamic decision-support systems. Existing solutions,
            however, are often expensive, complex, and inaccessible to smaller users. This project addresses these gaps
            by delivering a lightweight, scalable, AI-integrated platform.
          </p>
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-display font-semibold">Literature Survey</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {literature.map((l, i) => (
            <Card key={l.title} className="p-5 bg-card/60">
              <div className="text-xs font-mono text-primary mb-2">[{i + 1}]</div>
              <div className="font-semibold">{l.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{l.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-display font-semibold">Objectives</h2>
        <Card className="p-6 bg-card/60">
          <ol className="space-y-3">
            {objectives.map((o, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-primary shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground/90">{o}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}
