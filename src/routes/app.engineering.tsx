import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Layers, GitBranch, Package, Activity, Rewind, Network, Workflow } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/engineering")({
  head: () => ({
    meta: [
      { title: "AEON TTCN Engine — AEON Cloud" },
      { name: "description", content: "Architecture of the AEON TTCN-3 execution engine: scheduler, protocol stack, Jenkins integration, artifact store, and replay engine." },
      { property: "og:title", content: "AEON TTCN Engine — AEON Cloud" },
      { property: "og:description", content: "Behind the AEON TTCN-3 execution engine." },
    ],
  }),
  component: EnginePage,
});

const pillars = [
  { icon: Cpu, name: "Execution Engine", desc: "Multi-tenant TTCN-3 runtime executing 3GPP-compliant testcases across R15–R18 with deterministic timing." },
  { icon: Workflow, name: "Campaign Scheduler", desc: "Priority-aware scheduler routing jobs to the right tester based on hardware, SDR, and UE compatibility." },
  { icon: Layers, name: "Protocol Stack", desc: "Full 5G-SA/NSA and LTE stacks — NAS, RRC, RLC, MAC, PHY — with 3GPP procedure tracing." },
  { icon: GitBranch, name: "Jenkins Integration", desc: "Bi-directional bridge to Jenkins pipelines: trigger from CI, ingest artifacts, report back status checks." },
  { icon: Package, name: "Artifact Store", desc: "Content-addressed storage for firmware, logs, PCAPs, MSCs, and coverage reports with digital signatures." },
  { icon: Activity, name: "Execution Queue", desc: "Distributed FIFO queue with fair-share across tenants, back-pressure, and dead-letter isolation." },
  { icon: Rewind, name: "Replay Engine", desc: "Bit-exact re-execution of past runs against a new firmware build to reproduce regressions offline." },
  { icon: Network, name: "Traceability Graph", desc: "Graph linking commits ↔ builds ↔ executions ↔ verdicts ↔ 3GPP requirements for audit-grade certification." },
];

function EnginePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="AEON TTCN Engine"
        description="The distributed execution platform that powers every campaign on AEON Cloud."
        actions={<Badge variant="outline" className="border-primary/40 text-primary">v3.2 · Distributed</Badge>}
      />

      <div className="rounded-xl border border-border/70 bg-card p-6">
        <h3 className="text-sm font-semibold">Reference architecture</h3>
        <pre className="mt-4 overflow-x-auto rounded-md border border-border/60 bg-background p-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
{`┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Customer CI    │──▶│  aeon-cli / API │──▶│  Auth & RBAC    │
└─────────────────┘   └────────┬────────┘   └────────┬────────┘
                               │                     │
                               ▼                     ▼
                      ┌─────────────────┐   ┌─────────────────┐
                      │ Build Repo (S3) │   │ Project Service │
                      └────────┬────────┘   └────────┬────────┘
                               │                     │
                               ▼                     ▼
                      ┌─────────────────────────────────────┐
                      │        Campaign Scheduler           │
                      │  ┌──────────┐  ┌──────────┐         │
                      │  │  Queue   │─▶│ Placement│         │
                      │  └──────────┘  └────┬─────┘         │
                      └───────────────────┬─┴───────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
           ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
           │ Tester (EU-01)  │   │ Tester (US-02)  │   │ Tester (AP-01)  │
           │  TTCN Runtime   │   │  TTCN Runtime   │   │  TTCN Runtime   │
           │  ┌───────────┐  │   │  ┌───────────┐  │   │  ┌───────────┐  │
           │  │Proto Stack│  │   │  │Proto Stack│  │   │  │Proto Stack│  │
           │  │  NAS/RRC  │  │   │  │  NAS/RRC  │  │   │  │  NAS/RRC  │  │
           │  └─────┬─────┘  │   │  └─────┬─────┘  │   │  └─────┬─────┘  │
           │        ▼        │   │        ▼        │   │        ▼        │
           │  ┌───────────┐  │   │  ┌───────────┐  │   │  ┌───────────┐  │
           │  │ SDR + UE  │  │   │  │ SDR + UE  │  │   │  │ SDR + UE  │  │
           │  │ (B210)    │  │   │  │ (B210)    │  │   │  │ (LimeSDR) │  │
           │  └───────────┘  │   │  └───────────┘  │   │  └───────────┘  │
           └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                    │                     │                     │
                    └─────────────────────┼─────────────────────┘
                                          ▼
                              ┌─────────────────────┐
                              │  Artifact + Trace   │
                              │  Store (verdicts,   │
                              │  PCAP, MSC, logs)   │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ Reports · Copilot · │
                              │ Coverage · Replay   │
                              └─────────────────────┘`}
        </pre>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div key={p.name} className="rounded-xl border border-border/70 bg-card p-5">
            <div className="grid size-9 place-items-center rounded-md bg-primary/15 text-primary"><p.icon className="size-4" /></div>
            <h4 className="mt-3 text-sm font-semibold">{p.name}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h3 className="text-sm font-semibold">Compatibility</h3>
          <dl className="mt-3 divide-y divide-border/60 text-sm">
            {[
              ["3GPP releases", "R15 · R16 · R17 · R18"],
              ["Access types", "5G-SA · 5G-NSA · LTE Cat-M · Cat-1 · Cat-4"],
              ["SDR platforms", "Ettus USRP B210 · LimeSDR Mini / XTRX"],
              ["Deployment", "Public cloud · Private cloud · On-prem"],
              ["CI integrations", "GitHub Actions · GitLab CI · Jenkins · CircleCI"],
              ["Report formats", "PDF · XLSX · CSV · JSON · JUnit"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono text-xs">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h3 className="text-sm font-semibold">Runtime characteristics</h3>
          <dl className="mt-3 divide-y divide-border/60 text-sm">
            {[
              ["Scheduling latency (p50)", "12 ms"],
              ["Cold start (fresh tester)", "1.8 s"],
              ["Concurrent tenants", "unlimited"],
              ["Per-tenant fair-share", "weighted queues"],
              ["Determinism", "bit-exact replay"],
              ["Isolation", "hardware + namespace"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono text-xs">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
