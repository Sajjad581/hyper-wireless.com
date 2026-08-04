"use client";

import { CheckCircle2, Clock, Play, Square, XCircle } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Badge } from "@aeon/components/ui/badge";
import { Button } from "@aeon/components/ui/button";
import { Progress } from "@aeon/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@aeon/components/ui/tabs";

const testcases = [
  { id: "TC_6_1_1_1", name: "Initial Registration", verdict: "PASS", time: "1.2s" },
  { id: "TC_6_1_1_2", name: "Mobility Registration Update", verdict: "PASS", time: "0.9s" },
  { id: "TC_6_1_1_3", name: "Periodic Registration Update", verdict: "PASS", time: "1.4s" },
  { id: "TC_6_1_1_4", name: "Emergency Registration", verdict: "FAIL", time: "2.1s" },
  { id: "TC_6_1_1_5", name: "Deregistration UE-initiated", verdict: "RUN", time: "—" },
  { id: "TC_6_1_1_6", name: "Deregistration NW-initiated", verdict: "PEND", time: "—" },
];

const logs = [
  "[12:04:22.104] RRC: RRCSetupRequest sent",
  "[12:04:22.198] RRC: RRCSetup received",
  "[12:04:22.312] RRC: RRCSetupComplete sent",
  "[12:04:22.415] NAS: REGISTRATION REQUEST sent (5GS mobile identity: SUCI)",
  "[12:04:22.601] NAS: AUTHENTICATION REQUEST received",
  "[12:04:22.712] NAS: AUTHENTICATION RESPONSE sent",
  "[12:04:22.890] NAS: SECURITY MODE COMMAND received",
  "[12:04:23.011] NAS: SECURITY MODE COMPLETE sent",
  "[12:04:23.202] NAS: REGISTRATION ACCEPT received",
  "[12:04:23.288] NAS: REGISTRATION COMPLETE sent",
];

export default function ExecutionsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Execution #4821"
        description="Aria-5G-M2 · campaign NR_5GS_Registration · tester eu-03 · Release 18"
        actions={
          <>
            <Button variant="outline" className="gap-2"><Square className="size-4" /> Cancel</Button>
            <Button className="gap-2"><Play className="size-4" /> New run</Button>
          </>
        }
      />

      <Tabs defaultValue="live">
        <TabsList>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current testcase</p>
              <p className="font-mono text-sm">TC_6_1_1_5 · Deregistration UE-initiated</p>
            </div>
            <Badge variant="outline" className="gap-1 border-warning/40 text-warning"><Clock className="size-3" /> Running · 02:14</Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Campaign progress</span>
              <span className="font-mono">62% · 3 of 6 completed</span>
            </div>
            <Progress value={62} className="mt-2 h-1.5" />
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Console log</p>
            <div className="mt-2 max-h-72 overflow-auto rounded-md border border-border/60 bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              {logs.map((l, i) => <p key={i}>{l}</p>)}
              <p className="text-primary">[12:04:23.312] ▶ Starting TC_6_1_1_5…</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-sm font-semibold">Testcases</p>
            </div>
            <ul className="divide-y divide-border/60 text-sm">
              {testcases.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                  {t.verdict === "PASS" && <CheckCircle2 className="size-4 shrink-0 text-success" />}
                  {t.verdict === "FAIL" && <XCircle className="size-4 shrink-0 text-destructive" />}
                  {t.verdict === "RUN" && <Clock className="size-4 shrink-0 text-warning" />}
                  {t.verdict === "PEND" && <span className="size-4 shrink-0 rounded-full border border-border" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs">{t.id}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.name}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{t.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">MSC sequence</p>
            <div className="mt-3 grid h-40 place-items-center rounded-md border border-dashed border-border/70 bg-secondary/20 text-xs text-muted-foreground">
              MSC diagram · UE ↔ gNB ↔ AMF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
