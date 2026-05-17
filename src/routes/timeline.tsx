import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — MarketSim" },
      { name: "description", content: "Project Gantt chart and milestones for the Major Project 2025-26." },
    ],
  }),
  component: TimelinePage,
});

interface Task {
  name: string;
  start: string;
  end: string;
  duration: string;
  depends: string;
}

const tasks: Task[] = [
  { name: "Topic Selection", start: "2026-03-31", end: "2026-04-03", duration: "4 days", depends: "None" },
  { name: "Literature Review", start: "2026-04-04", end: "2026-04-20", duration: "17 days", depends: "Topic Selection" },
  { name: "Research Proposal", start: "2026-04-21", end: "2026-04-30", duration: "10 days", depends: "Literature Review" },
  { name: "Data Collection", start: "2026-05-01", end: "2026-05-31", duration: "31 days", depends: "Research Proposal" },
  { name: "Data Analysis", start: "2026-06-01", end: "2026-06-24", duration: "24 days", depends: "Data Collection" },
  { name: "Thesis / Report Writing", start: "2026-06-25", end: "2026-07-15", duration: "21 days", depends: "Data Analysis" },
  { name: "Final Revisions and Editing", start: "2026-07-16", end: "2026-07-25", duration: "10 days", depends: "Thesis/Report Writing" },
  { name: "Submission", start: "2026-07-30", end: "2026-07-30", duration: "1 day", depends: "Final Revisions and Editing" },
];

function TimelinePage() {
  // Compute Gantt positions (relative to project window)
  const allDates = tasks.flatMap((t) => [new Date(t.start), new Date(t.end)]);
  const min = Math.min(...allDates.map((d) => d.getTime()));
  const max = Math.max(...allDates.map((d) => d.getTime()));
  const span = max - min;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader eyebrow="Schedule" title="Project Timeline" description="Gantt chart of phases from topic selection through final submission." />

      <Card className="p-6 bg-card/60 mb-6 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[200px_1fr] gap-x-4 text-xs uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b border-border">
            <div>Task</div>
            <div>Apr 2026 ── May ── Jun ── Jul</div>
          </div>
          <div className="space-y-3">
            {tasks.map((t, i) => {
              const ts = new Date(t.start).getTime();
              const te = new Date(t.end).getTime();
              const left = ((ts - min) / span) * 100;
              const width = Math.max(1.5, ((te - ts) / span) * 100);
              return (
                <div key={t.name} className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{t.duration}</div>
                  </div>
                  <div className="relative h-7 bg-background/40 rounded">
                    <div
                      className="absolute top-1 bottom-1 rounded-md flex items-center px-2 text-[10px] font-mono text-primary-foreground"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        background: i === tasks.length - 1
                          ? "var(--gradient-primary)"
                          : `oklch(${0.55 + (i * 0.03)} 0.15 ${165 + i * 12})`,
                      }}
                      title={`${t.start} → ${t.end}`}
                    >
                      <span className="truncate">{t.start.slice(5)} – {t.end.slice(5)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card/60 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left py-2 px-2">Task</th>
              <th className="text-left py-2 px-2">Start</th>
              <th className="text-left py-2 px-2">End</th>
              <th className="text-left py-2 px-2">Duration</th>
              <th className="text-left py-2 px-2">Depends On</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {tasks.map((t) => (
              <tr key={t.name} className="border-b border-border/40">
                <td className="py-2 px-2 font-sans">{t.name}</td>
                <td className="py-2 px-2 text-muted-foreground">{t.start}</td>
                <td className="py-2 px-2 text-muted-foreground">{t.end}</td>
                <td className="py-2 px-2">{t.duration}</td>
                <td className="py-2 px-2 text-muted-foreground">{t.depends}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
