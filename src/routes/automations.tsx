import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Pill, SectionHeader } from "@/components/ui-kit";
import {
  Plus,
  GitPullRequest,
  Bot,
  MessageSquare,
  FileText,
  ChevronDown,
  Trash2,
  Workflow,
  Power,
} from "lucide-react";

export const Route = createFileRoute("/automations")({
  head: () => ({ meta: [{ title: "Automation Rules · GitClaw PM" }] }),
  component: AutomationsPage,
});

const repos = [
  "vercel/next.js",
  "shadcn-ui/ui",
  "supabase/supabase",
  "facebook/react",
  "All repositories",
];

const savedRules = [
  { name: "Bug triage → Slack", repo: "vercel/next.js", runs: 1284, enabled: true },
  { name: "PR summary → Notion", repo: "shadcn-ui/ui", runs: 421, enabled: true },
  { name: "Stale issue sweeper", repo: "All repositories", runs: 88, enabled: false },
];

function AutomationsPage() {
  const [repo, setRepo] = useState(repos[0]);
  const [enabled, setEnabled] = useState(true);
  const [rules, setRules] = useState(savedRules);

  return (
    <AppShell>
      <SectionHeader
        title="Automation Rules"
        description="Compose triggers and actions. Routed through Neurometric, executed via Composio."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Plus className="h-3.5 w-3.5" /> New rule
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold">Rule Builder</h2>
                <Pill tone="muted">Draft</Pill>
              </div>
              <button
                onClick={() => setEnabled((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs"
              >
                <span className="text-muted-foreground">Enabled</span>
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                      enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <RuleStep
                kind="IF"
                tone="accent"
                icon={GitPullRequest}
                title="A new Issue is opened"
                subtitle="GitHub trigger · webhook"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Repository:</span>
                  <div className="relative">
                    <select
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      className="appearance-none bg-muted/40 border border-border rounded-md pl-2.5 pr-7 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {repos.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </RuleStep>

              <Connector />

              <RuleStep
                kind="THEN"
                tone="success"
                icon={Bot}
                title="Run Neurometric ClawPack"
                subtitle="Classify sentiment, type, and severity"
              >
                <div className="flex flex-wrap gap-1.5">
                  {["sentiment", "type:bug|feat|q", "severity", "duplicate?"].map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] rounded border border-border/70 bg-muted/30 px-1.5 py-0.5 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </RuleStep>

              <Connector />

              <RuleStep
                kind="THEN"
                tone="success"
                icon={FileText}
                title="Create Notion card"
                subtitle="Composio action · notion.pages.create"
              >
                <div className="text-xs text-muted-foreground font-mono">
                  database: <span className="text-foreground">Triage Inbox</span>
                </div>
              </RuleStep>

              <Connector />

              <RuleStep
                kind="THEN"
                tone="success"
                icon={MessageSquare}
                title="Notify Slack channel"
                subtitle="Composio action · slack.chat.postMessage"
              >
                <div className="text-xs text-muted-foreground font-mono">
                  channel: <span className="text-primary">#dev-alerts</span>
                </div>
              </RuleStep>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-medium hover:bg-muted transition">
                Test run
              </button>
              <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
                Save rule
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Saved rules</h2>
            <Pill tone="muted">{rules.length}</Pill>
          </div>
          <ul className="space-y-2">
            {rules.map((r, i) => (
              <li
                key={r.name}
                className="rounded-lg border border-border/60 bg-muted/20 p-3 hover:border-border transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      {r.repo}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setRules((prev) =>
                        prev.map((x, j) => (i === j ? { ...x, enabled: !x.enabled } : x)),
                      )
                    }
                    className={`shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold ${
                      r.enabled
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Power className="h-3 w-3" /> {r.enabled ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono">{r.runs.toLocaleString()} runs</span>
                  <button className="hover:text-destructive transition" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function RuleStep({
  kind,
  tone,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  kind: "IF" | "THEN";
  tone: "accent" | "success";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const accent =
    tone === "accent"
      ? "border-accent/40 bg-accent/10 text-accent"
      : "border-primary/40 bg-primary/10 text-primary";
  return (
    <div className="rounded-xl border border-border bg-card/70 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 font-mono text-[10px] font-bold tracking-widest rounded px-1.5 py-1 border ${accent}`}
        >
          {kind}
        </div>
        <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border grid place-items-center shrink-0">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center">
      <div className="h-5 w-px bg-gradient-to-b from-border to-transparent" />
    </div>
  );
}
