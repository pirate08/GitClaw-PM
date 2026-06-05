import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Pill, SectionHeader } from "@/components/ui-kit";
import { Play, Pause, Download, Filter } from "lucide-react";

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Live Logs · GitClaw PM" }] }),
  component: LogsPage,
});

type Level = "info" | "ok" | "warn" | "err";
type LogLine = { t: string; src: string; level: Level; msg: string; payload?: object };

const sources = ["trustclaw", "neurometric", "supabase", "composio"];

const samples: Omit<LogLine, "t">[] = [
  {
    src: "trustclaw",
    level: "info",
    msg: "agent.tick scheduler=cron",
    payload: { agent: "issue-triager", repos: 12 },
  },
  {
    src: "composio",
    level: "ok",
    msg: "github.webhook received issues.opened",
    payload: { repo: "vercel/next.js", number: 42891, actor: "octocat" },
  },
  {
    src: "neurometric",
    level: "info",
    msg: "clawpack.classify start model=clawpack-7b",
    payload: { tokens_in: 384, route: "slm" },
  },
  {
    src: "neurometric",
    level: "ok",
    msg: "clawpack.classify done in 312ms",
    payload: { label: "bug", severity: "high", confidence: 0.94 },
  },
  {
    src: "supabase",
    level: "ok",
    msg: "vector.upsert issues_embeddings",
    payload: { id: "iss_42891", dims: 1536 },
  },
  {
    src: "composio",
    level: "ok",
    msg: "notion.pages.create db=triage-inbox",
    payload: { page_id: "8f1c…ae2" },
  },
  {
    src: "composio",
    level: "ok",
    msg: "slack.chat.postMessage channel=#dev-alerts",
    payload: { ts: "1717533321.001" },
  },
  {
    src: "trustclaw",
    level: "warn",
    msg: "rate-limit close to threshold",
    payload: { provider: "github", remaining: 142 },
  },
  {
    src: "neurometric",
    level: "err",
    msg: "embedding.batch retry attempt=2",
    payload: { error: "ETIMEDOUT", backoff_ms: 800 },
  },
];

function ts() {
  const d = new Date();
  return d.toISOString().split("T")[1].replace("Z", "");
}

const levelColor: Record<Level, string> = {
  info: "text-sky-400",
  ok: "text-primary",
  warn: "text-warning",
  err: "text-destructive",
};

function LogsPage() {
  const [lines, setLines] = useState<LogLine[]>(() =>
    samples.slice(0, 6).map((s) => ({ ...s, t: ts() })),
  );
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const s = samples[Math.floor(Math.random() * samples.length)];
      setLines((prev) => [...prev.slice(-150), { ...s, t: ts() }]);
    }, 1200);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const shown = lines.filter((l) => filter === "all" || l.src === filter);

  return (
    <AppShell>
      <SectionHeader
        title="Live Execution Logs"
        description="Streaming JSON payloads between TrustClaw, Neurometric, Composio, and Supabase."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted transition"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted transition">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        }
      />

      <Card className="overflow-hidden p-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-card/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
            </div>
            <span className="ml-3 text-xs font-mono text-muted-foreground">
              gitclaw-pm · agent.stream
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-muted-foreground" />
            {["all", ...sources].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide transition ${
                  filter === s
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
            <Pill tone={paused ? "muted" : "success"}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  paused ? "bg-muted-foreground" : "bg-primary animate-pulse"
                }`}
              />
              {paused ? "paused" : "streaming"}
            </Pill>
          </div>
        </div>

        {/* Terminal */}
        <div
          ref={scrollRef}
          className="h-[60vh] overflow-y-auto bg-[oklch(0.13_0.012_260)] p-4 font-mono text-[12px] leading-relaxed"
        >
          {shown.map((l, i) => (
            <div key={i} className="group flex gap-3 hover:bg-white/[0.02] -mx-2 px-2 rounded">
              <span className="text-muted-foreground/70 select-none">{l.t}</span>
              <span className={`uppercase text-[10px] mt-0.5 ${levelColor[l.level]}`}>
                {l.level.padEnd(4)}
              </span>
              <span className="text-accent">[{l.src}]</span>
              <span className="text-foreground flex-1">
                {l.msg}
                {l.payload && (
                  <span className="text-muted-foreground">
                    {" "}
                    {JSON.stringify(l.payload)}
                  </span>
                )}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>$</span>
            <span className="h-3.5 w-1.5 bg-primary animate-pulse" />
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
