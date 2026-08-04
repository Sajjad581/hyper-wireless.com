"use client";

import { Fragment, useState } from "react";
import {
  Search, Filter, Play, Save, Upload, Plus, Clock, CheckCircle2, XCircle,
  Terminal, Radio, Cpu, Calendar, MapPin, Activity, GitBranch, Download,
} from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@aeon/components/ui/tabs";
import { Input } from "@aeon/components/ui/input";
import { Button } from "@aeon/components/ui/button";
import { Badge } from "@aeon/components/ui/badge";
import { Progress } from "@aeon/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@aeon/components/ui/select";

const catalog = [
  { id: "TC_6_1_1_1", release: "R17", procedure: "Registration", cat: "NAS", status: "stable", cov: 98 },
  { id: "TC_6_1_1_2", release: "R17", procedure: "Registration", cat: "NAS", status: "stable", cov: 96 },
  { id: "TC_6_1_1_4", release: "R17", procedure: "Emergency Reg", cat: "NAS", status: "beta", cov: 74 },
  { id: "TC_7_2_1_1", release: "R17", procedure: "PDU Session Est.", cat: "SM", status: "stable", cov: 91 },
  { id: "TC_5_5_1_2", release: "R18", procedure: "Mobility", cat: "RRC", status: "beta", cov: 62 },
  { id: "TC_9_1_2_3", release: "R17", procedure: "Security Mode", cat: "NAS", status: "stable", cov: 100 },
  { id: "TC_4_2_1_5", release: "R16", procedure: "Attach", cat: "LTE-NAS", status: "deprecated", cov: 88 },
];

const campaigns = [
  { name: "Nightly regression · R17", cases: 512, dur: "1h 42m", schedule: "Daily 22:00", type: "regression" },
  { name: "Smoke · Registration + Mobility", cases: 42, dur: "6m", schedule: "On build push", type: "smoke" },
  { name: "R18 release validation", cases: 218, dur: "38m", schedule: "Manual", type: "release" },
  { name: "Security compliance", cases: 96, dur: "14m", schedule: "Weekly", type: "regression" },
];

const queue = [
  { id: "#4823", project: "Aria-5G-M2", campaign: "Nightly regression · R17", tester: "eu-03", priority: "high", eta: "in 4m" },
  { id: "#4824", project: "Nova-LTE-Cat4", campaign: "Smoke", tester: "us-02", priority: "normal", eta: "in 12m" },
  { id: "#4825", project: "Orion-5G-SA", campaign: "Security compliance", tester: "eu-01", priority: "low", eta: "in 28m" },
];

const historical = [
  { build: "#4821", commit: "a3f9c21", when: "2m ago", dur: "—", pass: 62, artifacts: 3 },
  { build: "#4820", commit: "8ee1b09", when: "34m ago", dur: "8m 12s", pass: 100, artifacts: 4 },
  { build: "#4819", commit: "5c02aa4", when: "1h ago", dur: "12m 08s", pass: 97.6, artifacts: 5 },
  { build: "#4818", commit: "1d7f0aa", when: "3h ago", dur: "6m 42s", pass: 100, artifacts: 3 },
];

const testers = [
  { id: "eu-01", loc: "Frankfurt DC1", hw: "Ettus B210 · x86_64", sdr: "USRP B210", ue: "Aria-5G-M2 (v2.4.0)", status: "busy", util: 74 },
  { id: "eu-02", loc: "Frankfurt DC1", hw: "LimeSDR XTRX · arm64", sdr: "LimeSDR XTRX", ue: "Orion-5G-SA (v1.2.1)", status: "idle", util: 12 },
  { id: "eu-03", loc: "Amsterdam DC2", hw: "Ettus B210 · x86_64", sdr: "USRP B210", ue: "Aria-5G-M2 (v2.4.1-rc3)", status: "busy", util: 92 },
  { id: "us-01", loc: "Ashburn DC3", hw: "LimeSDR Mini · x86_64", sdr: "LimeSDR Mini", ue: "—", status: "idle", util: 3 },
  { id: "us-02", loc: "Ashburn DC3", hw: "Ettus B210 · x86_64", sdr: "USRP B210", ue: "Nova-LTE-Cat4 (v1.9.4)", status: "reserved", util: 0 },
  { id: "ap-01", loc: "Singapore DC4", hw: "LimeSDR XTRX · arm64", sdr: "LimeSDR XTRX", ue: "—", status: "offline", util: 0 },
];

export default function TestingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Testing"
        description="TTCN-3 catalog, campaigns, live executions, coverage, and physical labs."
        actions={<Button className="gap-1.5"><Play className="size-3.5" /> New execution</Button>}
      />

      <Tabs defaultValue="catalog">
        <TabsList className="flex-wrap">
          <TabsTrigger value="catalog">Test Catalog</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Manager</TabsTrigger>
          <TabsTrigger value="queue">Execution Queue</TabsTrigger>
          <TabsTrigger value="live">Live Execution</TabsTrigger>
          <TabsTrigger value="historical">Historical Builds</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="lab">Lab Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search TC_… / procedure / clause" className="h-9 pl-8" />
            </div>
            <Select defaultValue="all"><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">All releases</SelectItem><SelectItem value="r18">R18</SelectItem><SelectItem value="r17">R17</SelectItem><SelectItem value="r16">R16</SelectItem>
            </SelectContent></Select>
            <Select defaultValue="all"><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">All categories</SelectItem><SelectItem value="nas">NAS</SelectItem><SelectItem value="rrc">RRC</SelectItem><SelectItem value="sm">SM</SelectItem>
            </SelectContent></Select>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="size-3.5" /> Filters</Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Testcase</th>
                  <th className="px-4 py-2.5 font-medium">Release</th>
                  <th className="px-4 py-2.5 font-medium">Procedure</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Coverage</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {catalog.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-4 py-3">{t.release}</td>
                    <td className="px-4 py-3">{t.procedure}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="font-mono text-[10px]">{t.cat}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        t.status === "stable" ? "border-success/40 text-success" :
                        t.status === "beta" ? "border-warning/40 text-warning" : "border-border text-muted-foreground"
                      }>{t.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={t.cov} className="h-1.5 w-24" />
                        <span className="font-mono text-xs text-muted-foreground">{t.cov}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Open</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button className="gap-1.5"><Plus className="size-3.5" /> Create campaign</Button>
            <Button variant="outline" className="gap-1.5"><Save className="size-3.5" /> Save current</Button>
            <Button variant="outline" className="gap-1.5"><Upload className="size-3.5" /> Import YAML</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {campaigns.map((c) => (
              <div key={c.name} className="rounded-xl border border-border/70 bg-card p-4">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold">{c.name}</h4>
                  <Badge variant="outline" className="font-mono text-[10px]">{c.type}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Cases</dt><dd className="font-mono">{c.cases}</dd></div>
                  <div><dt className="text-muted-foreground">Duration</dt><dd className="font-mono">{c.dur}</dd></div>
                  <div><dt className="text-muted-foreground">Schedule</dt><dd className="font-mono">{c.schedule}</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="gap-1.5"><Play className="size-3" /> Run</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="mt-5">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Job</th>
                  <th className="px-4 py-2.5 font-medium">Project</th>
                  <th className="px-4 py-2.5 font-medium">Campaign</th>
                  <th className="px-4 py-2.5 font-medium">Tester</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">ETA</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {queue.map((q) => (
                  <tr key={q.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.id}</td>
                    <td className="px-4 py-3">{q.project}</td>
                    <td className="px-4 py-3">{q.campaign}</td>
                    <td className="px-4 py-3 font-mono text-xs">{q.tester}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        q.priority === "high" ? "border-destructive/40 text-destructive" :
                        q.priority === "normal" ? "border-primary/40 text-primary" : "border-border text-muted-foreground"
                      }>{q.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{q.eta}</td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Cancel</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="live" className="mt-5">
          <LiveExecution />
        </TabsContent>

        <TabsContent value="historical" className="mt-5">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Build</th>
                  <th className="px-4 py-2.5 font-medium">Commit</th>
                  <th className="px-4 py-2.5 font-medium">When</th>
                  <th className="px-4 py-2.5 font-medium">Duration</th>
                  <th className="px-4 py-2.5 font-medium">Pass rate</th>
                  <th className="px-4 py-2.5 font-medium">Artifacts</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {historical.map((h) => (
                  <tr key={h.build} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{h.build}</td>
                    <td className="px-4 py-3"><span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">{h.commit}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{h.when}</td>
                    <td className="px-4 py-3 font-mono text-xs">{h.dur}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={h.pass} className="h-1.5 w-24" />
                        <span className="font-mono text-xs">{h.pass}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{h.artifacts} files</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" className="gap-1"><Activity className="size-3" /> Replay</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { k: "Release coverage", v: 87, hint: "R17: 92% · R18: 62%" },
              { k: "Feature coverage", v: 74, hint: "312 / 421 features" },
              { k: "Procedure coverage", v: 91, hint: "NAS, RRC, SM, PHY" },
              { k: "Requirement coverage", v: 68, hint: "TS 24.501 / TS 38.331" },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-border/70 bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{c.k}</p>
                <p className="mt-2 text-2xl font-semibold">{c.v}%</p>
                <Progress value={c.v} className="mt-2 h-1.5" />
                <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Procedure heatmap</h3>
              <Button size="sm" variant="outline" className="gap-1.5"><Download className="size-3.5" /> Export CSV</Button>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 96 }).map((_, i) => {
                const v = (i * 37) % 100;
                const alpha = 0.15 + (v / 100) * 0.75;
                return <div key={i} className="aspect-square rounded-sm" style={{ background: `color-mix(in oklab, var(--color-primary) ${Math.round(alpha * 100)}%, transparent)` }} />;
              })}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex flex-1 h-1.5 rounded-full" style={{ background: "linear-gradient(to right, color-mix(in oklab, var(--color-primary) 15%, transparent), var(--color-primary))" }} />
              <span>High</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lab" className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard label="Available testers" value="3" hint="of 6 online" icon={Radio} />
            <StatCard label="Reserved" value="1" hint="us-02 · 4h" icon={Calendar} />
            <StatCard label="Locations" value="4" hint="EU, US, AP" icon={MapPin} />
            <StatCard label="Connected UE" value="4" hint="across 3 projects" icon={Cpu} />
          </div>
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Tester</th>
                  <th className="px-4 py-2.5 font-medium">Location</th>
                  <th className="px-4 py-2.5 font-medium">Hardware</th>
                  <th className="px-4 py-2.5 font-medium">SDR</th>
                  <th className="px-4 py-2.5 font-medium">Connected UE</th>
                  <th className="px-4 py-2.5 font-medium">Utilization</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {testers.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.loc}</td>
                    <td className="px-4 py-3 text-xs">{t.hw}</td>
                    <td className="px-4 py-3 font-mono text-xs">{t.sdr}</td>
                    <td className="px-4 py-3 text-xs">{t.ue}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Progress value={t.util} className="h-1.5 w-20" /><span className="font-mono text-xs">{t.util}%</span></div></td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        t.status === "idle" ? "border-success/40 text-success" :
                        t.status === "busy" ? "border-warning/40 text-warning" :
                        t.status === "reserved" ? "border-primary/40 text-primary" : "border-border text-muted-foreground"
                      }>{t.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Reserve</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold">Reservation calendar · this week</h3>
            <div className="mt-4 grid grid-cols-8 gap-1 text-xs">
              <div />
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="text-center text-muted-foreground">{d}</div>)}
              {["eu-01", "eu-02", "eu-03", "us-01", "us-02", "ap-01"].map((row) => (
                <Fragment key={row}>
                  <div className="font-mono text-muted-foreground">{row}</div>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const busy = (row.charCodeAt(0) + i) % 3 === 0;
                    const half = (row.charCodeAt(1) + i) % 4 === 0;
                    return (
                      <div key={i} className="h-6 rounded-sm border border-border/50 bg-secondary/30">
                        {busy && <div className="h-full rounded-sm bg-primary/60" style={{ width: half ? "50%" : "100%" }} />}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{label}</p><Icon className="size-4 text-muted-foreground" /></div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function LiveExecution() {
  const [log] = useState<string[]>([
    "[14:22:03.112] scheduler: assigning TC_6_1_1_4 to tester eu-03",
    "[14:22:03.418] tester eu-03: RF chain warm-up complete (USRP B210)",
    "[14:22:03.902] ue Aria-5G-M2: PLMN 001/01 selected",
    "[14:22:04.117] ue → gNB: RRCSetupRequest",
    "[14:22:04.203] gNB → ue: RRCSetup",
    "[14:22:04.298] ue → gNB: RRCSetupComplete (RegistrationRequest)",
    "[14:22:04.402] amf: 5G-GUTI unavailable, requesting SUCI",
    "[14:22:04.605] ue: NAS timer T3510 started",
    "[14:22:05.011] amf → ue: IdentityRequest (SUCI)",
    "[14:22:05.298] ue → amf: IdentityResponse — WARN: encoding mismatch",
    "[14:22:05.412] amf: rejecting registration — Cause #22 (Congestion)",
    "[14:22:05.418] verdict: FAIL — expected Cause #23",
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border/70 bg-card lg:col-span-2">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2"><Terminal className="size-4 text-primary" /><h3 className="text-sm font-semibold">Execution #4821 · TC_6_1_1_4</h3></div>
          <Badge variant="outline" className="gap-1 border-warning/40 text-warning"><Clock className="size-3" /> Running · 142 / 214</Badge>
        </div>
        <div className="border-b border-border/60 px-4 py-3">
          <Progress value={62} className="h-1.5" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Tester eu-03 · Aria-5G-M2 v2.4.1-rc3</span><span>ETA 2m 14s</span></div>
        </div>
        <div className="max-h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {log.map((l, i) => (
            <div key={i} className={l.includes("FAIL") ? "text-destructive" : l.includes("WARN") ? "text-warning" : "text-muted-foreground"}>{l}</div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <h4 className="text-sm font-semibold">Live entities</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span className="flex items-center gap-2"><Cpu className="size-3.5 text-muted-foreground" /> UE</span><Badge variant="outline" className="border-warning/40 text-warning">RRC_CONNECTED</Badge></li>
            <li className="flex justify-between"><span className="flex items-center gap-2"><Radio className="size-3.5 text-muted-foreground" /> gNB</span><Badge variant="outline" className="border-success/40 text-success">ACTIVE</Badge></li>
            <li className="flex justify-between"><span className="flex items-center gap-2"><Radio className="size-3.5 text-muted-foreground" /> AMF</span><Badge variant="outline" className="border-success/40 text-success">READY</Badge></li>
          </ul>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <h4 className="text-sm font-semibold">Protocol MSC</h4>
          <div className="mt-3 space-y-1 font-mono text-[10px]">
            {["UE  → gNB   RRCSetupRequest", "gNB → UE    RRCSetup", "UE  → gNB   RRCSetupComplete", "UE  → AMF   RegistrationRequest", "AMF → UE    IdentityRequest", "UE  → AMF   IdentityResponse", "AMF → UE    RegistrationReject"].map((l, i) => (
              <div key={i} className="rounded bg-secondary/60 px-2 py-1">{l}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <h4 className="text-sm font-semibold">Timers</h4>
          <ul className="mt-3 space-y-1 font-mono text-xs">
            <li className="flex justify-between"><span>T3510</span><span className="text-warning">running · 1.2s</span></li>
            <li className="flex justify-between"><span>T3502</span><span className="text-muted-foreground">stopped</span></li>
            <li className="flex justify-between"><span>T3346</span><span className="text-muted-foreground">stopped</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
