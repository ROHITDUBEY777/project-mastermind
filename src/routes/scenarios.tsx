import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, FolderOpen, LineChart as LineChartIcon, Plus } from "lucide-react";
import { useScenarios } from "@/lib/store/scenarios";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/scenarios")({
  head: () => ({
    meta: [
      { title: "Scenarios — MarketSim" },
      { name: "description", content: "Saved simulation scenarios. Compare strategies side-by-side." },
    ],
  }),
  component: ScenariosPage,
});

function ScenariosPage() {
  const scenarios = useScenarios((s) => s.scenarios);
  const remove = useScenarios((s) => s.remove);
  const clear = useScenarios((s) => s.clear);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Saved Runs"
        title="Scenarios"
        description="Each saved scenario captures the full parameter set and simulation result so you can compare strategies."
      />

      <div className="flex gap-2 mb-6">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/simulator"><Plus className="h-4 w-4 mr-2" /> New scenario</Link>
        </Button>
        {scenarios.length > 0 && (
          <Button variant="outline" onClick={() => { clear(); toast.success("All scenarios cleared"); }}>
            Clear all
          </Button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <Card className="p-12 bg-card/40 border-dashed text-center">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-display font-semibold">No scenarios saved yet</h3>
          <p className="text-sm text-muted-foreground mt-2">Run a simulation and save it to start comparing strategies.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s) => {
            const totalProfit = s.result.summary.finalProfit.reduce((a, b) => a + b, 0);
            return (
              <Card key={s.id} className="p-5 bg-card/60 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="font-mono text-[10px]">{s.params.steps} ticks</Badge>
                  <Badge variant="secondary" className="font-mono text-[10px]">{s.params.firms.length} firms</Badge>
                  <Badge className="font-mono text-[10px] bg-primary/20 text-primary border-primary/30">Winner: {s.result.summary.winner}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-background/50 rounded p-2">
                    <div className="text-muted-foreground text-[10px] uppercase">Total Profit</div>
                    <div className="text-success">${Math.round(totalProfit).toLocaleString()}</div>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <div className="text-muted-foreground text-[10px] uppercase">Base Price</div>
                    <div>${s.params.basePrice}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  {s.params.firms.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{f.name}</span>
                      <span className="text-success">${Math.round(s.result.summary.finalProfit[i]).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" size="sm" className="w-full mt-4">
                  <Link to="/forecast" search={{ id: s.id } as any}>
                    <LineChartIcon className="h-3 w-3 mr-2" /> Forecast
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
