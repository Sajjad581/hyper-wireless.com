"use client";

import Link from "next/link";
import { CheckCircle2, HelpCircle, MinusCircle } from "lucide-react";
import { Badge } from "@aeon/components/ui/badge";
import { Button } from "@aeon/components/ui/button";
import { SiteNav } from "@aeon/components/marketing/site-nav";
import { SiteFooter } from "@aeon/components/marketing/site-footer";

const plans = [
  {
    name: "Developer", price: "$0", period: "/mo", tag: "Free forever",
    desc: "For individual engineers exploring 3GPP conformance.", cta: "Start free", highlight: false,
    features: ["1 project", "50 executions / month", "Shared tester pool", "PDF reports", "Community support"],
  },
  {
    name: "Startup", price: "$1,490", period: "/mo", tag: "Most popular",
    desc: "For product teams shipping certified UE devices.", cta: "Start 14-day trial", highlight: true,
    features: ["10 projects", "1,500 executions / month", "Priority tester scheduling", "AI Copilot", "Full report suite + API", "Business-hours support"],
  },
  {
    name: "Enterprise", price: "Custom", period: "", tag: "Managed",
    desc: "Dedicated infrastructure for chipset vendors and OEMs.", cta: "Contact sales", highlight: false,
    features: ["Unlimited projects & executions", "Dedicated tester & SDR pool", "Private cloud / on-prem option", "Dedicated TTCN-3 engineer", "SSO / SAML / audit logs", "24/7 premium support & SLA"],
  },
];

const matrix = [
  { section: "Test execution", rows: [
    ["Concurrent executions", "1", "5", "Unlimited"],
    ["Monthly executions", "50", "1,500", "Unlimited"],
    ["Tester pool", "Shared", "Priority shared", "Dedicated"],
    ["3GPP releases", "Rel 15–17", "Rel 15–18", "Rel 15–18"],
    ["Custom TTCN-3 suites", false, false, true],
  ]},
  { section: "AI Copilot", rows: [
    ["Failure analysis", false, true, true],
    ["3GPP clause mapping", false, true, true],
    ["Chat context window", "—", "200K tokens", "1M tokens"],
  ]},
  { section: "Reports & data", rows: [
    ["Formats", "PDF", "PDF · CSV · JSON · XLSX", "All + custom"],
    ["Retention", "30 days", "12 months", "Configurable"],
    ["Data export API", false, true, true],
  ]},
  { section: "Security & governance", rows: [
    ["SSO / SAML / OIDC", false, false, true],
    ["RBAC & audit logs", "Basic", "Standard", "Advanced + immutable"],
    ["Data residency", "EU", "EU / US", "EU / US / APAC"],
    ["DPA & security review", false, true, true],
  ]},
  { section: "Support", rows: [
    ["Channel", "Community", "Business hours", "24/7 + Slack Connect"],
    ["Response SLA", "—", "8h", "1h"],
    ["Dedicated TTCN-3 engineer", false, false, true],
  ]},
];

const faqs = [
  { q: "What counts as an execution?", a: "A single TTCN-3 testcase run on a reserved lane. Suites are billed per contained testcase." },
  { q: "Do I need my own chamber or SDR?", a: "No. AEON Cloud lanes ship with LimeSDR and Ettus B210 hardware inside shielded enclosures." },
  { q: "Can I bring my own TTCN-3 suites?", a: "Enterprise plans support custom suites alongside our maintained 3GPP Release 15–18 catalog." },
  { q: "Is on-prem available?", a: "Yes — Enterprise customers can deploy AEON Cloud in a private VPC or on-prem rack with the same portal experience." },
  { q: "How is data isolated?", a: "Per-tenant VPCs, per-workspace RBAC, mutual-TLS tunnels, AES-256 at rest, TLS 1.3 in transit." },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <CheckCircle2 className="mx-auto size-4 text-primary" />;
  if (v === false) return <MinusCircle className="mx-auto size-4 text-muted-foreground/60" />;
  return <span className="text-sm text-foreground/90">{v}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-5 border-border/70 bg-card/50 text-xs text-muted-foreground">Pricing</Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Plans that scale with your certification program
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Start free. Upgrade to Startup when you need the AI Copilot and priority scheduling.
              Move to Enterprise when you need dedicated hardware and SSO.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={"relative rounded-xl border p-6 " + (p.highlight ? "border-primary/50 bg-card shadow-[var(--shadow-elevated)]" : "border-border/70 bg-card/60")}>
                {p.highlight && (
                  <Badge className="absolute -top-2.5 left-6 bg-primary text-primary-foreground">{p.tag}</Badge>
                )}
                <p className="text-sm font-semibold">{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <Link href="/register" className="mt-5 block">
                  <Button className="w-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button>
                </Link>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Compare plans</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Every capability, side-by-side</h2>

          <div className="mt-10 overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="w-[36%] px-5 py-3 text-left font-medium">Capability</th>
                  <th className="px-5 py-3 text-center font-medium">Developer</th>
                  <th className="px-5 py-3 text-center font-medium text-primary">Startup</th>
                  <th className="px-5 py-3 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              {matrix.map((group) => (
                <tbody key={group.section}>
                  <tr className="border-t border-border/60 bg-secondary/30">
                    <td colSpan={4} className="px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{group.section}</td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row[0] as string} className="border-t border-border/60">
                      <td className="px-5 py-3 font-medium">{row[0]}</td>
                      <td className="px-5 py-3 text-center"><Cell v={row[1]} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={row[2]} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={row[3]} /></td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Questions engineers actually ask</h2>
          <dl className="mt-10 divide-y divide-border/60">
            {faqs.map((f) => (
              <div key={f.q} className="grid gap-2 py-5 md:grid-cols-[auto_1fr]">
                <HelpCircle className="mt-0.5 size-4 text-primary" />
                <div>
                  <dt className="text-sm font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Need something custom?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Chipset vendors and Tier-1 OEMs run AEON Cloud with dedicated SDR pools, private VPC, and a named TTCN-3 engineer.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register"><Button size="lg">Start free</Button></Link>
            <Button size="lg" variant="outline">Contact sales</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
