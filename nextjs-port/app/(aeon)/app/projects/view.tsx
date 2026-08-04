"use client";

import { Plus, Search, Wifi, WifiOff } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Input } from "@aeon/components/ui/input";
import { Badge } from "@aeon/components/ui/badge";

const projects = [
  { name: "Aria-5G-M2", vendor: "Aria Semi", chipset: "AR-N78", release: "Rel 18", branch: "main", build: "v2.4.1-rc3", connected: true },
  { name: "Nova-LTE-Cat4", vendor: "Nova Wireless", chipset: "NV-L4", release: "Rel 15", branch: "release/1.9", build: "v1.9.0", connected: true },
  { name: "Orion-5G-SA", vendor: "Orion IoT", chipset: "OR-SA1", release: "Rel 17", branch: "main", build: "v0.8.4", connected: false },
  { name: "Helix-NB-IoT", vendor: "Helix Micro", chipset: "HX-NB2", release: "Rel 16", branch: "develop", build: "v3.0.0-beta", connected: true },
  { name: "Pulse-CatM1", vendor: "Pulse Labs", chipset: "PL-CM1", release: "Rel 15", branch: "main", build: "v2.1.7", connected: false },
  { name: "Vega-5G-NSA", vendor: "Vega Systems", chipset: "VG-NSA", release: "Rel 16", branch: "main", build: "v1.4.2", connected: true },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Projects"
        description="Each project represents a UE under certification."
        actions={<Button className="gap-2"><Plus className="size-4" /> New project</Button>}
      />

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search projects" placeholder="Search projects…" className="pl-8" />
        </div>
        <Button variant="outline" size="sm">All vendors</Button>
        <Button variant="outline" size="sm">All releases</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Project</th>
              <th className="px-4 py-2.5 font-medium">Vendor</th>
              <th className="px-4 py-2.5 font-medium">Chipset</th>
              <th className="px-4 py-2.5 font-medium">Release</th>
              <th className="px-4 py-2.5 font-medium">Branch</th>
              <th className="px-4 py-2.5 font-medium">Current build</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {projects.map((p) => (
              <tr key={p.name} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.vendor}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.chipset}</td>
                <td className="px-4 py-3"><Badge variant="secondary">{p.release}</Badge></td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.branch}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.build}</td>
                <td className="px-4 py-3">
                  {p.connected ? (
                    <Badge variant="outline" className="gap-1 border-success/40 text-success"><Wifi className="size-3" /> Connected</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-border text-muted-foreground"><WifiOff className="size-3" /> Disconnected</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
