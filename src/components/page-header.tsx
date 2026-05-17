import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border-b border-border pb-6 mb-8"
    >
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">{eyebrow}</div>
      )}
      <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
