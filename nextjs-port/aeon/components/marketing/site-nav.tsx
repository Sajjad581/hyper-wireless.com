"use client";

import Link from "next/link";
import { BrandLogo } from "@aeon/components/brand-logo";
import { Button } from "@aeon/components/ui/button";

const nav = [
  { to: "/platform", label: "Platform" },
  { to: "/workflow", label: "Workflow" },
  { to: "/pricing", label: "Pricing" },
  { to: "/docs", label: "Docs" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/"><BrandLogo /></Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className="hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link href="/register"><Button size="sm">Start free trial</Button></Link>
        </div>
      </div>
    </header>
  );
}
