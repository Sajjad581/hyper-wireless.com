import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Boxes,
  Cable,
  Cpu,
  GitBranch,
  Globe2,
  KeyRound,
  LineChart,
  Lock,
  Network,
  Radio,
  ScrollText,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform — AEON Cloud" },
      { name: "description", content: "AEON Cloud unifies TTCN-3 test execution, SDR-based radio infrastructure, build storage, and an AI Telecom Copilot for 3GPP UE certification — delivered as a managed cloud." },
      { property: "og:title", content: "Platform — AEON Cloud" },
      { property: "og:description", content: "The managed cloud stack for 3GPP UE certification: TTCN-3 runner, SDR test lanes, build repository, live execution monitor, and AI Telecom Copilot." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/platform" },
      { name: "twitter:title", content: "Platform — AEON Cloud" },
      { name: "twitter:description", content: "Managed cloud TTCN-3 testing, SDR lanes, build storage, and an AI Telecom Copilot for 3GPP UE certification." },
    ],
    links: [{ rel: "canonical", href: "https://aeon-cloud-connect.lovable.app/platform" }],
  }),
  component: PlatformPage,
});

const pillars = [
  {
    icon: Radio,
    title: "TTCN-3 Test Runner",
    body: "3GPP Release 15–18 conformance suites executed against your UE. TS 38.521 (RF), TS 38.523 (protocol), TS 36.523 (LTE), TS 38.533 (RRM).",
    tags: ["NR SA", "NR NSA", "LTE-A", "EN-DC"],
  },
  {
    icon: Cpu,
    title: "SDR Test Lanes",
    body: "LimeSDR and Ettus B210 based test lanes in shielded enclosures. Deterministic RF at a fraction of the CAPEX of chamber systems.",
    tags: ["LimeSDR", "Ettus B210", "Faraday cage"],
  },
  {
    icon: GitBranch,
    title: "Build Repository",
    body: "Versioned UE firmware storage with branches, tags, checksums, and provenance. Push over CLI, HTTPS API, or the Web.",
    tags: ["zip", "tar.gz", "Docker", "raw"],
  },
  {
    icon: Bot,
    title: "AI Telecom Copilot",
    body: "3GPP-aware assistant. Maps TTCN-3 verdicts to spec clauses, suggests fixes, and explains protocol procedures on demand.",
    tags: ["TS 24.501", "TS 38.331", "TS 23.502"],
  },
  {
    icon: LineChart,
    title: "Live Execution",
    body: "Watch the running testcase, MSC sequence, verdict stream, and console logs in real time. Pause, resume, or cancel any run.",
    tags: ["MSC", "PCAP", "Logs"],
  },
  {
    icon: ScrollText,
    title: "Certification Reports",
    body: "PDF, CSV, JSON, and XLSX exports with 3GPP traceability, coverage matrices, and executive summaries ready for submission.",
    tags: ["PDF", "CSV", "JSON", "XLSX"],
  },
];

const compare = [
  { row: "Deployment model", aeon: "Cloud, OpEx, per-execution", legacy: "Chamber system, CAPEX ($1M+)" },
  { row: "Provisioning time", aeon: "Minutes", legacy: "Weeks to months" },
  { row: "Radio infrastructure", aeon: "LimeSDR / Ettus B210 lanes", legacy: "Vendor-specific chamber HW" },
  { row: "Debug assistance", aeon: "AI Copilot, 3GPP-aware", legacy: "Engineer-only, manual" },
  { row: "Build repository", aeon: "Built-in, versioned", legacy: "External file share" },
  { row: "API / CI-CD", aeon: "First-class REST + tokens", legacy: "Limited, custom scripts" },
  { row: "Reports", aeon: "PDF · CSV · JSON · XLSX", legacy: "Vendor PDF" },
];

const security = [
  { icon: Lock, title: "End-to-end encryption", body: "TLS 1.3 in transit, AES-256 at rest, mutual-TLS to reserved labs." },
  { icon: KeyRound, title: "SSO, MFA, RBAC", body: "SAML 2.0 and OIDC, TOTP MFA, granular per-workspace roles." },
  { icon: ShieldCheck, title: "Audit + compliance", body: "Immutable audit log, SOC 2 aligned controls, GDPR-ready DPA." },
  { icon: Network, title: "Network isolation", body: "Per-tenant VPC lanes, private tunnels, IP allowlists on API tokens." },
];

const integrations = [
  "GitHub Actions", "GitLab CI", "Jenkins", "Bitbucket Pipelines",
  "Slack", "Microsoft Teams", "Webhook", "REST API",
  "OpenID Connect", "SAML 2.0", "Terraform", "CLI",
];

function PlatformPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-5 border-border/70 bg-card/50 text-xs text-muted-foreground">Platform</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              The managed cloud stack for 3GPP UE certification
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              AEON Cloud unifies TTCN-3 test execution, SDR-based radio infrastructure, versioned build storage,
              and an AI Telecom Copilot. One workspace replaces a rack of vendor tooling.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg">Start free</Button></Link>
              <Link to="/docs"><Button size="lg" variant="outline">Read the docs</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Six pillars</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Certification, without the rack</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-xl border border-border/70 bg-card/60 p-6">
                <div className="grid size-9 place-items-center rounded-md border border-border/70 bg-secondary/60 text-primary">
                  <p.icon className="size-4.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md border border-border/70 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">AEON Cloud vs. legacy chamber systems</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Cloud OpEx vs. seven-figure CAPEX</h2>
            <p className="mt-3 text-muted-foreground">
              Traditional protocol conformance rigs from Anritsu (ME7834NR) or Rohde &amp; Schwarz (TS-RRM) are excellent —
              and cost $1M+ upfront. AEON Cloud delivers the same 3GPP coverage on demand.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-border/70 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Capability</th>
                  <th className="px-5 py-3 font-medium text-primary">AEON Cloud</th>
                  <th className="px-5 py-3 font-medium">Chamber system</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((c) => (
                  <tr key={c.row} className="border-t border-border/60">
                    <td className="px-5 py-3 font-medium">{c.row}</td>
                    <td className="px-5 py-3 text-foreground">{c.aeon}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.legacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Enterprise security</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Built for regulated modem teams</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {security.map((s) => (
              <div key={s.title} className="rounded-xl border border-border/70 bg-card/60 p-6">
                <s.icon className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Integrations</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Wire it into your existing toolchain</h2>
              <p className="mt-3 text-muted-foreground">
                AEON Cloud speaks the languages your engineers already use — CI/CD, chat, identity, and infra-as-code.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/docs"><Button variant="outline">API reference</Button></Link>
                <Link to="/app/tokens"><Button variant="ghost" className="gap-2"><Terminal className="size-4" /> Manage tokens</Button></Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {integrations.map((i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-2.5 text-xs text-muted-foreground">
                  <Cable className="size-3.5 text-primary" />
                  <span className="truncate">{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-primary">
            <Globe2 className="size-5" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Available in EU, US, and APAC regions</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Data residency you can prove. Reserve testers in the region that matches your compliance footprint.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button size="lg">Create free workspace</Button></Link>
            <Link to="/workflow"><Button size="lg" variant="outline" className="gap-2"><Workflow className="size-4" /> See the workflow</Button></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
