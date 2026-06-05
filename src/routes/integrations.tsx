import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Pill, SectionHeader } from "@/components/ui-kit";
import { Check, Plug, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/integrations")({
  head: () => ({ meta: [{ title: "Integrations · GitClaw PM" }] }),
  component: IntegrationsPage,
});

type Integration = {
  id: string;
  name: string;
  description: string;
  scopes: string[];
  color: string;
  initial: string;
  connected: boolean;
};

const initial: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Issues, PRs, reviews, comments, and webhooks.",
    scopes: ["repo", "issues", "pull_requests"],
    color: "from-zinc-200 to-zinc-400 text-zinc-900",
    initial: "GH",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post agent updates and standups to channels.",
    scopes: ["chat:write", "channels:read"],
    color: "from-fuchsia-400 to-purple-500 text-white",
    initial: "SL",
    connected: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync triaged issues to roadmap databases.",
    scopes: ["pages:write", "databases:read"],
    color: "from-stone-200 to-stone-400 text-stone-900",
    initial: "NO",
    connected: true,
  },
  {
    id: "jira",
    name: "Jira",
    description: "Create issues and transition statuses.",
    scopes: ["read:jira-work", "write:jira-work"],
    color: "from-sky-400 to-blue-600 text-white",
    initial: "JR",
    connected: false,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Mirror GitHub issues to Linear cycles.",
    scopes: ["read", "write"],
    color: "from-indigo-400 to-violet-600 text-white",
    initial: "LN",
    connected: false,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Community announcements & release notes.",
    scopes: ["bot", "messages.send"],
    color: "from-indigo-500 to-blue-700 text-white",
    initial: "DC",
    connected: false,
  },
];

function IntegrationsPage() {
  const [items, setItems] = useState(initial);

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)),
    );

  return (
    <AppShell>
      <SectionHeader
        title="Connected Integrations"
        description="Secure OAuth connections brokered by Composio. Toggle to simulate the flow."
        action={
          <Pill tone="accent">
            <Plug className="h-3 w-3" /> {items.filter((i) => i.connected).length} active
          </Pill>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <Card
            key={i.id}
            className={`p-5 transition-all ${
              i.connected
                ? "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`h-11 w-11 rounded-lg bg-gradient-to-br ${i.color} grid place-items-center text-sm font-bold tracking-tight`}
              >
                {i.initial}
              </div>
              <Pill tone={i.connected ? "success" : "muted"}>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    i.connected ? "bg-primary" : "bg-muted-foreground"
                  }`}
                />
                {i.connected ? "Connected" : "Disconnected"}
              </Pill>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold">{i.name}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.description}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {i.scopes.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] rounded border border-border/70 bg-muted/30 px-1.5 py-0.5 text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={() => toggle(i.id)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${
                  i.connected
                    ? "bg-muted/60 text-foreground hover:bg-muted"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {i.connected ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Manage connection
                  </>
                ) : (
                  <>
                    <Plug className="h-3.5 w-3.5" /> Connect via Composio
                  </>
                )}
              </button>
              <button
                className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
                aria-label="Docs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* toggle switch */}
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[11px] text-muted-foreground">Auto-sync events</span>
              <button
                onClick={() => toggle(i.id)}
                role="switch"
                aria-checked={i.connected}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  i.connected ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                    i.connected ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
