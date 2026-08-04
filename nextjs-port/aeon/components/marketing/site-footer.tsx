"use client";

import Link from "next/link";
import { BrandLogo } from "@aeon/components/brand-logo";

const columns = [
  { title: "Product", links: [
    { label: "Platform", to: "/platform" as const },
    { label: "Workflow", to: "/workflow" as const },
    { label: "Pricing", to: "/pricing" as const },
    { label: "Documentation", to: "/docs" as const },
  ]},
  { title: "Developers", links: [
    { label: "Docs", to: "/docs" as const },
    { label: "API tokens", to: "/app/tokens" as const },
    { label: "Sign in", to: "/login" as const },
    { label: "Create account", to: "/register" as const },
  ]},
  { title: "Solutions", links: [
    { label: "Chipset vendors", to: "/platform" as const },
    { label: "UE OEMs", to: "/platform" as const },
    { label: "Modem teams", to: "/platform" as const },
    { label: "Certification labs", to: "/platform" as const },
  ]},
  { title: "Company", links: [
    { label: "Blog", to: "/blog" as const },
    { label: "Workflow", to: "/workflow" as const },
    { label: "Pricing", to: "/pricing" as const },
    { label: "Docs", to: "/docs" as const },
  ]},
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <BrandLogo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Cloud-based 3GPP UE certification. Remote TTCN-3 execution on real SDR hardware with an AI Telecom Copilot.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Release 15 – 18 · TS 38.521 · TS 38.523 · TS 36.523
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.to} className="text-foreground/80 hover:text-foreground">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} AEON Cloud. All rights reserved.</span>
          <span className="font-mono">v2026.07 · region: eu-west-1 · all systems operational</span>
        </div>
      </div>
    </footer>
  );
}
