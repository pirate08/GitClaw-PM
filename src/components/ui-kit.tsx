import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/60 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "accent" | "muted";
}) {
  const tones: Record<string, string> = {
    default: "border-border bg-card text-foreground",
    success: "border-primary/30 bg-primary/10 text-primary",
    warning: "border-warning/30 bg-warning/10 text-warning",
    accent: "border-accent/30 bg-accent/10 text-accent",
    muted: "border-border bg-muted/40 text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
