import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Plug,
  Workflow,
  Terminal,
  KeyRound,
  Sparkles,
  Github,
  Circle,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/automations", label: "Automation Rules", icon: Workflow },
  { to: "/logs", label: "Live Logs", icon: Terminal },
  { to: "/billing", label: "API Keys & Billing", icon: KeyRound },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">GitClaw PM</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Autonomous Agent
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Workspace
          </div>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-all ${
                  active
                    ? "bg-sidebar-accent text-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${active ? "text-primary" : "group-hover:text-foreground"}`}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-lg border border-sidebar-border bg-card/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">TrustClaw Status</span>
            <span className="inline-flex items-center gap-1.5 text-primary">
              <Circle className="h-2 w-2 fill-primary text-primary" /> Online
            </span>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground font-mono">
            v0.42.1 · us-east-1
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/70 backdrop-blur-xl px-4 md:px-8">
          <div className="md:hidden flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> GitClaw PM
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Github className="h-3.5 w-3.5" />
            <span>workspace</span>
            <span className="opacity-40">/</span>
            <span className="text-foreground">{pathname === "/" ? "overview" : pathname.slice(1)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Agents healthy
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">
              DV
            </div>
          </div>
        </header>
        <div className="px-4 md:px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
