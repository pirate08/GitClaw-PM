import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Pill, SectionHeader } from "@/components/ui-kit";
import { Copy, Eye, EyeOff, Plus, CreditCard, Zap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "API Keys & Billing · GitClaw PM" }] }),
  component: BillingPage,
});

const keys = [
  { name: "production", prefix: "nm_live_", tail: "k29Xa", created: "Apr 12, 2026", lastUsed: "12s ago" },
  { name: "ci-runner", prefix: "nm_live_", tail: "8fQpL", created: "Mar 03, 2026", lastUsed: "4h ago" },
  { name: "local-dev", prefix: "nm_test_", tail: "Rw02d", created: "Feb 21, 2026", lastUsed: "2d ago" },
];

function BillingPage() {
  const [reveal, setReveal] = useState<string | null>(null);

  return (
    <AppShell>
      <SectionHeader
        title="API Keys & Billing"
        description="Manage Neurometric credentials and monitor ClawPack credit usage."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Pill tone="accent">Neurometric · Free Tier</Pill>
                  <Pill tone="muted">ClawPack SLM</Pill>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight font-mono">4.2M</span>
                  <span className="text-muted-foreground font-mono">/ 100M tokens</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Routed via SLM-first policy. Heavy tasks escalate to ClawPack-70B.
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
                <TrendingUp className="h-3.5 w-3.5" /> Upgrade plan
              </button>
            </div>

            <div className="mt-6 h-3 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary relative"
                style={{ width: "4.2%" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
              {[
                { k: "Used", v: "4,210,488", c: "text-foreground" },
                { k: "Remaining", v: "95,789,512", c: "text-primary" },
                { k: "Resets in", v: "26d 14h", c: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-border/60 bg-card/60 p-3">
                  <div className="text-muted-foreground">{s.k}</div>
                  <div className={`mt-1 font-mono ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Billing</h2>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-xs text-muted-foreground">Current plan</div>
            <div className="mt-1 text-lg font-semibold">Developer · Free</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              100M tokens · 3 agents · unlimited integrations
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <Row k="Next invoice" v="$0.00" />
            <Row k="Renews on" v="Jul 01, 2026" />
            <Row k="Payment method" v="—" />
          </div>
          <button className="mt-5 w-full rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted transition inline-flex items-center justify-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Add payment method
          </button>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">API Keys</h2>
            <p className="text-xs text-muted-foreground">
              Used by TrustClaw workers and CI runners to call Neurometric.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Plus className="h-3.5 w-3.5" /> New key
          </button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Name</th>
                <th className="text-left font-medium px-4 py-2.5">Token</th>
                <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">Created</th>
                <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">Last used</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const live = k.prefix.includes("live");
                const isRevealed = reveal === k.name;
                return (
                  <tr key={k.name} className="border-t border-border hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{k.name}</span>
                        <Pill tone={live ? "success" : "muted"}>{live ? "live" : "test"}</Pill>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span className="text-muted-foreground">{k.prefix}</span>
                      <span>{isRevealed ? "9w2Hf73Lq" + k.tail : "•••••••••" + k.tail}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {k.created}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {k.lastUsed}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setReveal(isRevealed ? null : k.name)}
                          className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                          {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 last:border-0 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}
