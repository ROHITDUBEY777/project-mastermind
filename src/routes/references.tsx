import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "References — MarketSim" },
      { name: "description", content: "References cited in the project synopsis." },
    ],
  }),
  component: ReferencesPage,
});

const references = [
  { authors: "J. Smith and A. Kumar", title: "Agent-Based Modeling for Competitive Market Simulation", venue: "IEEE Access, vol. 11, pp. 45231–45245, 2023." },
  { authors: "L. Zhang, R. Mehta, and S. Gupta", title: "Machine Learning Approaches for Demand Forecasting in Dynamic Markets", venue: "IEEE Transactions on Knowledge and Data Engineering, vol. 36, no. 2, pp. 1123–1135, 2024." },
  { authors: "M. Patel and S. Rao", title: "Computational Economics and Market Simulation Frameworks", venue: "Journal of Computational Economics, vol. 28, pp. 215–229, 2023." },
  { authors: "K. Iyer and P. Verma", title: "Predictive Analytics in Business Strategy", venue: "International Journal of Business Analytics, vol. 12, no. 3, pp. 88–104, 2024." },
  { authors: "A. Banerjee and N. Singh", title: "Interactive Decision Support Systems with Visualization", venue: "Decision Support Systems Journal, vol. 159, pp. 1–14, 2022." },
];

function ReferencesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <PageHeader eyebrow="Bibliography" title="References" description="Sources cited in the synopsis informing the methodology and literature survey." />
      <Card className="p-6 bg-card/60">
        <ol className="space-y-4">
          {references.map((r, i) => (
            <li key={i} className="flex gap-4 text-sm leading-relaxed border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <span className="font-mono text-primary shrink-0">[{i + 1}]</span>
              <span>
                <span className="text-foreground/90">{r.authors}</span>,{" "}
                <em className="text-foreground">"{r.title}"</em>,{" "}
                <span className="text-muted-foreground">{r.venue}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
