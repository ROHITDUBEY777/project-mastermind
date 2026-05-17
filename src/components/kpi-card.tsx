import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({ label, value, delta, trend = "neutral", icon: Icon, className }: KpiCardProps) {
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className={cn("p-5 bg-card/80 backdrop-blur border-border/60 hover:border-primary/50 transition-colors", className)}>
        <div className="flex items-start justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-2 text-2xl font-semibold font-mono tabular-nums">{value}</div>
        {delta && <div className={cn("mt-1 text-xs font-mono", trendColor)}>{delta}</div>}
      </Card>
    </motion.div>
  );
}
