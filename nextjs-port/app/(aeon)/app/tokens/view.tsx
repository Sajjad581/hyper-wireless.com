"use client";

import { Copy, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Badge } from "@aeon/components/ui/badge";

const tokens = [
  { name: "ci-runner", scope: "executions:write, builds:write", created: "2026-06-14", lastUsed: "12m ago", expires: "2027-06-14" },
  { name: "grafana-readonly", scope: "reports:read", created: "2026-05-02", lastUsed: "3h ago", expires: "Never" },
  { name: "local-dev", scope: "*", created: "2026-04-19", lastUsed: "2d ago", expires: "2026-10-19" },
];

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="API Tokens"
        description="Programmatic access to AEON Cloud. Scope tokens to the minimum permissions required."
        actions={<Button className="gap-2"><Plus className="size-4" /> Generate token</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Permissions</th>
              <th className="px-4 py-2.5 font-medium">Created</th>
              <th className="px-4 py-2.5 font-medium">Last used</th>
              <th className="px-4 py-2.5 font-medium">Expires</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {tokens.map((t) => (
              <tr key={t.name} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.scope.split(",").map((s) => (
                      <Badge key={s} variant="secondary" className="font-mono text-[10px]">{s.trim()}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.created}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.lastUsed}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.expires}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost"><Copy className="size-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
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
