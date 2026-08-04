import { createFileRoute } from "@tanstack/react-router";
import { Download, GitBranch, Upload } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/builds")({
  head: () => ({
    meta: [
      { title: 'Build Repository — AEON Cloud' },
      { name: "description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
      { property: "og:title", content: 'Build Repository — AEON Cloud' },
      { property: "og:description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
      { name: "twitter:title", content: 'Build Repository — AEON Cloud' },
      { name: "twitter:description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
    ],
  }),
  component: BuildsPage,
});

const builds = [
  { v: "v2.4.1-rc3", branch: "main", commit: "a41e9c2", date: "2026-07-04", who: "Priya S.", status: "ready", size: "184 MB" },
  { v: "v2.4.1-rc2", branch: "main", commit: "9f3b1de", date: "2026-07-02", who: "Priya S.", status: "ready", size: "184 MB" },
  { v: "v2.4.0", branch: "release/2.4", commit: "77c2f10", date: "2026-06-28", who: "CI Bot", status: "released", size: "182 MB" },
  { v: "v2.3.9", branch: "release/2.3", commit: "3a20aab", date: "2026-06-19", who: "Marek K.", status: "released", size: "179 MB" },
  { v: "v2.4.0-rc1", branch: "release/2.4", commit: "112eec9", date: "2026-06-24", who: "CI Bot", status: "archived", size: "182 MB" },
];

function BuildsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Build Repository"
        description="Versioned firmware storage — zip · tar.gz · Docker · raw firmware."
        actions={<Button className="gap-2"><Upload className="size-4" /> Upload build</Button>}
      />

      <div className="flex items-center gap-2 text-sm">
        <GitBranch className="size-4 text-muted-foreground" />
        <span className="font-mono">Aria-5G-M2</span>
        <span className="text-muted-foreground">/</span>
        <Badge variant="secondary">main</Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Version</th>
              <th className="px-4 py-2.5 font-medium">Branch</th>
              <th className="px-4 py-2.5 font-medium">Commit</th>
              <th className="px-4 py-2.5 font-medium">Uploaded</th>
              <th className="px-4 py-2.5 font-medium">By</th>
              <th className="px-4 py-2.5 font-medium">Size</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {builds.map((b) => (
              <tr key={b.v} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs">{b.v}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.branch}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.commit}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                <td className="px-4 py-3">{b.who}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.size}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      b.status === "ready" ? "border-primary/40 text-primary"
                      : b.status === "released" ? "border-success/40 text-success"
                      : "border-border text-muted-foreground"
                    }
                  >
                    {b.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost"><Download className="size-3.5" /></Button>
                    <Button size="sm" variant="outline">Run tests</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
