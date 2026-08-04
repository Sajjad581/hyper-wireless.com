"use client";

import { Download, FileText } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Badge } from "@aeon/components/ui/badge";

const reports = [
  { id: "R-2026-07-03", project: "Orion-5G-SA", campaign: "NR_PDU_Session", date: "2026-07-03", verdict: "Certified", cov: "96%" },
  { id: "R-2026-06-28", project: "Aria-5G-M2", campaign: "NR_5GS_Registration", date: "2026-06-28", verdict: "Partial", cov: "78%" },
  { id: "R-2026-06-21", project: "Nova-LTE-Cat4", campaign: "LTE_Attach_Detach", date: "2026-06-21", verdict: "Certified", cov: "100%" },
  { id: "R-2026-06-15", project: "Vega-5G-NSA", campaign: "NSA_Bearer_Setup", date: "2026-06-15", verdict: "Certified", cov: "94%" },
];

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Reports"
        description="Certification summaries, execution timelines, coverage, and 3GPP traceability."
        actions={<Button variant="outline" className="gap-2"><Download className="size-4" /> Export all</Button>}
      />

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { k: "Pass rate", v: "94.3%" },
          { k: "Coverage", v: "88%" },
          { k: "Certified TCs", v: "1,102" },
          { k: "3GPP mapped", v: "97.1%" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.k}</p>
            <p className="mt-2 text-2xl font-semibold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h3 className="text-sm font-semibold">Recent certification reports</h3>
          <div className="flex gap-1">
            {["PDF", "XLSX", "CSV", "JSON"].map((f) => (
              <Button key={f} size="sm" variant="ghost" className="h-7 font-mono text-xs">{f}</Button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Report</th>
              <th className="px-4 py-2.5 font-medium">Project</th>
              <th className="px-4 py-2.5 font-medium">Campaign</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Coverage</th>
              <th className="px-4 py-2.5 font-medium">Verdict</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="font-mono text-xs">{r.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{r.project}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.campaign}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.cov}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={r.verdict === "Certified" ? "border-success/40 text-success" : "border-warning/40 text-warning"}>
                    {r.verdict}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="outline">Open</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
