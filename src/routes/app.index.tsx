import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, ArrowUpRight, CheckCircle2, Clock, Cpu, FolderKanban, GitCommit,
  Package, Rocket, XCircle, Bot, Radio, Users, Calendar, Server, AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Engineering Dashboard — AEON Cloud" },
      { name: "description", content: "Live engineering overview: active projects, connected UEs, tester availability, running campaigns, recent builds, and AI recommendations." },
      { property: "og:title", content: "Engineering Dashboard — AEON Cloud" },
      { property: "og:description", content: "Live engineering overview across projects, testers, builds, and AI-assisted validation." },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Active projects", value: "12", delta: "+2 this week", icon: FolderKanban },
  { label: "Connected devices", value: "8", delta: "3 in queue", icon: Cpu },
  { label: "Testers available", value: "5 / 9", delta: "2 reserved · 2 busy", icon: Radio },
  { label: "Pass rate (30d)", value: "94.3%", delta: "+1.2 pp", icon: CheckCircle2 },
];

const runs = [
  { id: "#4821", project: "Aria-5G-M2", campaign: "NR_5GS_Registration", tester: "eu-03", status: "running", verdict: "142/214", started: "2m ago", progress: 62 },
  { id: "#4820", project: "Aria-5G-M2", campaign: "NR_5GS_Mobility", tester: "eu-01", status: "passed", verdict: "PASS 214/214", started: "34m ago", progress: 100 },
  { id: "#4819", project: "Nova-LTE-Cat4", campaign: "LTE_Attach_Detach", tester: "us-02", status: "failed", verdict: "FAIL 3/128", started: "1h ago", progress: 100 },
  { id: "#4818", project: "Orion-5G-SA", campaign: "NR_PDU_Session", tester: "eu-02", status: "passed", verdict: "PASS 96/96", started: "3h ago", progress: 100 },
];

const builds = [
  { v: "v2.4.1-rc3", project: "Aria-5G-M2", by: "priya.s", sig: "sha256:9f3a…", when: "12m" },
  { v: "v2.4.1-rc2", project: "Aria-5G-M2", by: "marek.k", sig: "sha256:71bd…", when: "3h" },
  { v: "v1.9.4", project: "Nova-LTE-Cat4", by: "ci-runner", sig: "sha256:22e0…", when: "1d" },
];

const commits = [
  { sha: "a3f9c21", msg: "nas: fix SUCI encoding on emergency reg", by: "yuki.t", when: "18m" },
  { sha: "8ee1b09", msg: "rrc: retry SIB1 acquisition on CRC fail", by: "priya.s", when: "1h" },
  { sha: "5c02aa4", msg: "phy: align PRACH ramp with 3GPP R17", by: "marek.k", when: "4h" },
];

const recs = [
  { level: "warn", text: "TC_6_1_1_4 failed 3× in last 24h — recurring NAS timing issue", ref: "TS 24.501 §5.5.1.2.2" },
  { level: "info", text: "Coverage dropped 2.1 pp on Mobility procedures after v2.4.1-rc2", ref: "compare rc1 vs rc2" },
  { level: "info", text: "Suggested regression: run NR_5GS_Security before rc3 promotion", ref: "campaign template" },
];

const reservations = [
  { tester: "eu-03", who: "Aria-5G-M2 · rc3", from: "14:00", to: "16:30" },
  { tester: "us-02", who: "Nova-LTE-Cat4 · nightly", from: "20:00", to: "23:00" },
  { tester: "eu-01", who: "Orion-5G-SA · smoke", from: "Tomorrow 09:00", to: "10:00" },
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Overview"
        description="Real-time view of your certification pipeline across all projects."
        actions={
          <>
            <Link to="/app/builds"><Button variant="outline" className="gap-1.5"><Package className="size-3.5" /> Upload build</Button></Link>
            <Link to="/app/testing"><Button className="gap-1.5"><Rocket className="size-3.5" /> Run test</Button></Link>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Current running campaigns</h2>
            </div>
            <Link to="/app/testing" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="divide-y divide-border/60">
            {runs.map((r) => (
              <div key={r.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm">
                <span className="col-span-2 font-mono text-xs text-muted-foreground">{r.id}</span>
                <div className="col-span-4">
                  <p className="font-medium">{r.campaign}</p>
                  <p className="text-xs text-muted-foreground">{r.project} · {r.tester}</p>
                </div>
                <div className="col-span-3">
                  <Progress value={r.progress} className="h-1.5" />
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{r.verdict}</p>
                </div>
                <div className="col-span-2"><StatusBadge status={r.status} /></div>
                <span className="col-span-1 text-right text-xs text-muted-foreground">{r.started}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Bot className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">AI recommendations</h2>
          </div>
          <ul className="divide-y divide-border/60 text-sm">
            {recs.map((r, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <AlertTriangle className={"mt-0.5 size-3.5 shrink-0 " + (r.level === "warn" ? "text-warning" : "text-muted-foreground")} />
                <div className="flex-1">
                  <p className="leading-snug">{r.text}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{r.ref}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Package className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent builds</h2>
          </div>
          <ul className="divide-y divide-border/60 text-sm">
            {builds.map((b) => (
              <li key={b.v} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{b.v}</span>
                  <span className="text-xs text-muted-foreground">{b.when}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{b.project} · by {b.by}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{b.sig}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/70 bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <GitCommit className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Latest git commits</h2>
          </div>
          <ul className="divide-y divide-border/60 text-sm">
            {commits.map((c) => (
              <li key={c.sha} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">{c.sha}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.when}</span>
                </div>
                <p className="mt-1 leading-snug">{c.msg}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.by}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/70 bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Calendar className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Upcoming reservations</h2>
          </div>
          <ul className="divide-y divide-border/60 text-sm">
            {reservations.map((r, i) => (
              <li key={i} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{r.tester}</span>
                  <span className="text-xs text-muted-foreground">{r.from} → {r.to}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.who}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-card p-4 lg:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Failure distribution (last 30 days)</p>
          <div className="mt-3 space-y-2 text-xs">
            {[
              { k: "Registration", v: 42 },
              { k: "Mobility", v: 28 },
              { k: "PDU Session", v: 18 },
              { k: "Security", v: 12 },
            ].map((row) => (
              <div key={row.k}>
                <div className="flex justify-between"><span>{row.k}</span><span className="font-mono text-muted-foreground">{row.v}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${row.v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="flex items-center gap-2">
            <Server className="size-4 text-success" />
            <p className="text-xs font-medium text-muted-foreground">System health</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-success">Operational</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>Scheduler · 12 ms</li>
            <li>Artifact store · 34 ms</li>
            <li>Copilot inference · 210 ms</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">Connected developers</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">14</p>
          <p className="mt-1 text-xs text-muted-foreground">across 3 organizations</p>
          <div className="mt-3 flex -space-x-2">
            {["AR", "PS", "MK", "YT", "SC"].map((i) => (
              <div key={i} className="grid size-7 place-items-center rounded-full border border-card bg-secondary font-mono text-[10px]">{i}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Billing usage · July</p>
        <div className="mt-2 flex items-baseline gap-3">
          <p className="text-2xl font-semibold">842</p>
          <p className="text-sm text-muted-foreground">/ 1,500 executions</p>
        </div>
        <Progress value={56} className="mt-3 h-1.5" />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Startup plan · renews Aug 1</span>
          <Link to="/app/billing" className="inline-flex items-center gap-1 text-foreground hover:underline">Manage <ArrowUpRight className="size-3" /></Link>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon?: React.ComponentType<{ className?: string }> }> = {
    running: { label: "Running", className: "border-warning/40 text-warning", icon: Clock },
    passed: { label: "Passed", className: "border-success/40 text-success", icon: CheckCircle2 },
    failed: { label: "Failed", className: "border-destructive/40 text-destructive", icon: XCircle },
    cancelled: { label: "Cancelled", className: "border-border text-muted-foreground" },
  };
  const it = map[status] ?? map.cancelled;
  const Icon = it.icon;
  return (
    <Badge variant="outline" className={"gap-1 " + it.className}>
      {Icon && <Icon className="size-3" />} {it.label}
    </Badge>
  );
}
