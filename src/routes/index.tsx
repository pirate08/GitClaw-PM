import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, Pill, SectionHeader } from "@/components/ui-kit";
import {
  Activity,
  GitBranch,
  Timer,
  Zap,
  GitPullRequest,
  MessageSquare,
  FileText,
  Bot,
  ArrowRight,
  CheckCircle2,
  Pause,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · GitClaw PM" },
      { name: "description", content: "Autonomous open-source project management agent overview." },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  { label: "Total Tasks Managed", value: "12,847", delta: "+312 this week", icon: Activity, tone: "success" as const },
  { label: "Active Repositories", value: "37", delta: "4 added", icon: GitBranch, tone: "accent" as const },
  { label: "Avg. Triage Time", value: "4.2m", delta: "−38% vs last week", icon: Timer, tone: "success" as const },
];

const agents = [
  { name: "GitHub Issue Triager", status: "running", desc: "Listening on 12 repos · 24/7", load: 78 },
  { name: "Slack Daily Standup Bot", status: "idle", desc: "Next run in 6h 12m", load: 0 },
  { name: "PR Summarizer (ClawPack-7B)", status: "running", desc: "Processing 3 in queue", load: 42 },
  { name: "Notion Roadmap Sync", status: "running", desc: "Last sync 38s ago", load: 12 },
  { name: "Stale Issue Sweeper", status: "paused", desc: "Paused by @dev_alex", load: 0 },
];

const timeline = [
  {
    time: "12:42:08",
    repo: "vercel/next.js",
    chain: [
      { icon: GitPullRequest, text: "Intercepted Issue #42891" },
      { icon: Bot, text: "Classified as Bug · severity high (ClawPack)" },
      { icon: FileText, text: "Notion card created in 'Triage Inbox'" },
      { icon: MessageSquare, text: "Posted to #dev-alerts" },
    ],
  },
  {
    time: "12:39:51",
    repo: "shadcn-ui/ui",
    chain: [
      { icon: GitPullRequest, text: "PR #5621 opened by @octocat" },
      { icon: Bot, text: "Summarized diff (1.4k LOC → 3 bullets)" },
      { icon: MessageSquare, text: "Review request → @maintainers" },
    ],
  },
  {
    time: "12:31:14",
    repo: "supabase/supabase",
    chain: [
      { icon: GitPullRequest, text: "Issue #19002 closed" },
      { icon: Bot, text: "Embedded → pgvector (memory updated)" },
      { icon: FileText, text: "Linked to roadmap milestone 'Q3 RLS'" },
    ],
  },
];

function Dashboard() {
  return (
    <AppShell>
      <SectionHeader
        title="Dashboard Overview"
        description="Live telemetry from your TrustClaw agents and Composio integrations."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Zap className="h-3.5 w-3.5" /> Deploy new agent
          </button>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="h-7 w-7 rounded-md bg-muted/60 grid place-items-center">
                <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight font-mono">{m.value}</div>
            <Pill tone={m.tone}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {m.delta}
            </Pill>
          </Card>
        ))}

        {/* Neurometric credits card */}
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Neurometric Free Credits</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight font-mono">
                  4.2M <span className="text-muted-foreground text-base font-normal">/ 100M tok</span>
                </div>
              </div>
              <Pill tone="accent">ClawPack SLM</Pill>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary"
                style={{ width: "4.2%" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>4.2% used</span>
              <span>resets in 26d</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Active agents + activity */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Active Agents</h2>
              <p className="text-xs text-muted-foreground">Background workers on TrustClaw</p>
            </div>
            <Pill tone="success">
              <Activity className="h-3 w-3" /> 4 / 5 live
            </Pill>
          </div>
          <ul className="space-y-2">
            {agents.map((a) => {
              const isRun = a.status === "running";
              const isPause = a.status === "paused";
              return (
                <li
                  key={a.name}
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:border-border transition"
                >
                  <div
                    className={`relative h-2 w-2 rounded-full ${
                      isRun ? "bg-primary" : isPause ? "bg-muted-foreground" : "bg-warning"
                    }`}
                  >
                    {isRun && (
                      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{a.desc}</div>
                  </div>
                  {isRun ? (
                    <div className="w-16 hidden sm:block">
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${a.load}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1 text-right">
                        {a.load}%
                      </div>
                    </div>
                  ) : (
                    <Pill tone={isPause ? "muted" : "warning"}>
                      {isPause ? <Pause className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {a.status}
                    </Pill>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Real-time agent action stream</p>
            </div>
            <Pill tone="accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Live
            </Pill>
          </div>
          <ol className="relative space-y-5">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            {timeline.map((t, i) => (
              <li key={i} className="relative pl-7">
                <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{t.time}</span>
                  <span className="text-xs text-foreground">{t.repo}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  {t.chain.map((step, j) => (
                    <span key={j} className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2 py-1 text-[11px]">
                        <step.icon className="h-3 w-3 text-muted-foreground" />
                        {step.text}
                      </span>
                      {j < t.chain.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </AppShell>
  );
}
