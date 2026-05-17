import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, LineChart, ShieldCheck, ArrowRight, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarketSim — Overview" },
      { name: "description", content: "Project overview: agent-based market simulation, ML forecasting, and strategy testing platform." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Activity, title: "Agent-Based Simulation", desc: "Autonomous consumer and firm agents generate realistic price, demand, and competition dynamics." },
  { icon: BrainCircuit, title: "Machine Learning", desc: "Regression and time-series forecasting integrated for adaptive demand prediction." },
  { icon: LineChart, title: "Interactive Dashboards", desc: "Live charts, KPI cards, and scenario comparison built for analyst-grade interpretation." },
  { icon: ShieldCheck, title: "Risk-Free Experiments", desc: "Test pricing, marketing, and competitive strategies with zero real-world cost." },
];

const team = [
  { name: "Shaikh Faris", usn: "1AY23CS165" },
  { name: "Rohit Dubey", usn: "1AY23CS153" },
  { name: "Ritvik Kowshik", usn: "1AY23CS152" },
  { name: "Satwick", usn: "1AY23CS162" },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="border-primary/40 text-primary mb-5 font-mono text-[10px] tracking-widest">
              BCS685 · MAJOR PROJECT PHASE 1 · 2025-26
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight leading-[1.05]">
              Market Simulation &<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Strategy Testing Platform
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              An intelligent, data-driven environment that replicates real-world market conditions, models agent
              behavior, and applies machine learning so users can test strategies without financial risk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/simulator">
                  Launch Simulator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/methodology">View Methodology</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/about">Read Abstract</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {[
              { k: "Agents", v: "500+" },
              { k: "Strategies", v: "3 Types" },
              { k: "ML Models", v: "Regression · ES" },
              { k: "Realtime", v: "100 ticks/s" },
            ].map((s) => (
              <div key={s.k} className="bg-card p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</div>
                <div className="mt-1 text-xl font-mono font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold mb-8">Platform capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="p-6 h-full bg-card/60 hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-base">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs tracking-widest">
              <GraduationCap className="h-4 w-4" /> ACHARYA INSTITUTE OF TECHNOLOGY
            </div>
            <h2 className="mt-3 text-2xl font-display font-semibold">Department of Computer Science & Engineering</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Project Group No. 19 · Academic Year 2025–2026
            </p>
            <div className="mt-6 rounded-md border border-border p-4 bg-background/40">
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Project Guide</div>
              <div className="mt-1 font-semibold">Mrs. Shrutika C R</div>
              <div className="text-sm text-muted-foreground">Assistant Professor, Dept. of CSE</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs tracking-widest mb-4">
              <Users className="h-4 w-4" /> TEAM
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {team.map((m) => (
                <Card key={m.usn} className="p-4 bg-card/80 border-border/60">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{m.usn}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
