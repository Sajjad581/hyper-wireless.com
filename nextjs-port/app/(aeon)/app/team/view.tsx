"use client";

import { UserPlus } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Badge } from "@aeon/components/ui/badge";

const members = [
  { name: "Alex Rivera", email: "alex@acme.com", role: "Owner", initials: "AR", active: "now" },
  { name: "Priya Sharma", email: "priya@acme.com", role: "Admin", initials: "PS", active: "12m" },
  { name: "Marek Kowalski", email: "marek@acme.com", role: "Developer", initials: "MK", active: "1h" },
  { name: "Yuki Tanaka", email: "yuki@acme.com", role: "Developer", initials: "YT", active: "3h" },
  { name: "Sara Cohen", email: "sara@acme.com", role: "Viewer", initials: "SC", active: "2d" },
];

const roleColor: Record<string, string> = {
  Owner: "border-primary/40 text-primary",
  Admin: "border-warning/40 text-warning",
  Developer: "border-success/40 text-success",
  Viewer: "border-border text-muted-foreground",
};

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Team"
        description="Invite teammates and control who can run executions and access reports."
        actions={<Button className="gap-2"><UserPlus className="size-4" /> Invite member</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Member</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Last active</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {members.map((m) => (
              <tr key={m.email} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-secondary font-mono text-xs">{m.initials}</div>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="outline" className={roleColor[m.role]}>{m.role}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{m.active}</td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-5">
        <h3 className="text-sm font-semibold">Role permissions</h3>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
          {[
            { r: "Owner", p: "Billing, security, delete workspace" },
            { r: "Admin", p: "Manage members, tokens, projects" },
            { r: "Developer", p: "Run executions, upload builds" },
            { r: "Viewer", p: "Read-only access to reports" },
          ].map((x) => (
            <div key={x.r} className="rounded-md border border-border/60 p-3">
              <Badge variant="outline" className={roleColor[x.r]}>{x.r}</Badge>
              <p className="mt-2 text-xs text-muted-foreground">{x.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
