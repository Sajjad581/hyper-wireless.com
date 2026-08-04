"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  GitBranch,
  LineChart,
  Lock,
  Radio,
  ShieldCheck,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "@aeon/components/ui/button";
import { Badge } from "@aeon/components/ui/badge";
import { SiteNav } from "@aeon/components/marketing/site-nav";
import { SiteFooter } from "@aeon/components/marketing/site-footer";

const features = [
  {
    icon: Radio,
    title: "Remote TTCN-3 Testing",
    body: "Upload your UE build, reserve a tester, and execute 3GPP conformance campaigns on real SDR hardware from anywhere.",
  },
  {
    icon: Bot,
    title: "AI Telecom Copilot",
    body: "Analyzes failures, maps TTCN verdicts to 3GPP clauses, suggests fixes, and explains procedures on demand.",
  },
  {
    icon: GitBranch,
    title: "Build Repository",
    body: "Versioned firmware storage with branches, commits, tags, and one-click rollback. zip · tar.gz · Docker · raw firmware.",
  },
  {
    icon: LineChart,
    title: "Live Execution Dashboard",
    body: "Watch the running testcase, MSC sequence, verdict stream, and console logs in real time.",
  },
  {
    icon: Boxes,
    title: "Certification Reports",
    body: "PDF · CSV · JSON · XLSX. Coverage, pass rate, 3GPP traceability, and executive certification summaries.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    body: "End-to-end encryption, SSO, RBAC, MFA, audit logs, and scoped API tokens. SOC 2 aligned controls.",
  },
];

const workflow = [
  { step: "01", title: "Upload build", body: "Push firmware to your build repository over CLI, API, or Web." },
  { step: "02", title: "Reserve tester", body: "Schedule an available AEON tester (SDR + RF chamber) in a region." },
  { step: "03", title: "Secure tunnel", body: "Your workstation connects via mutual-TLS to the reserved lab." },
  { step: "04", title: "Deploy & run", body: "The tester flashes your UE and executes the selected TTCN-3 campaign." },
  { step: "05", title: "Live monitor", body: "Stream verdicts, MSCs, and logs. Pause, resume, or cancel any run." },
  { step: "06", title: "Report & analyze", body: "Download certification reports. Ask the Copilot why a testcase failed." },
];

const plans = [
  {
    name: "Developer",
    price: "$0",
    period: "/mo",
    tag: "Free forever",
    desc: "For individual engineers exploring 3GPP conformance.",
    cta: "Start free",
    highlight: false,
    features: [
      "1 project",
      "50 executions / month",
      "Shared tester pool",
      "PDF reports",
      "Community support",
    ],
  },
  {
    name: "Startup",
    price: "$1,490",
    period: "/mo",
    tag: "Most popular",
    desc: "For product teams shipping certified UE devices.",
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "10 projects",
      "1,500 executions / month",
      "Priority tester scheduling",
      "AI Copilot",
      "Full report suite + API",
      "Business-hours support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tag: "Managed",
    desc: "Dedicated infrastructure for chipset vendors and OEMs.",
    cta: "Contact sales",
    highlight: false,
    features: [
      "Unlimited projects & executions",
      "Dedicated tester & SDR pool",
      "Private cloud / on-prem option",
      "Dedicated TTCN-3 engineer",
      "SSO / SAML / audit logs",
      "24/7 premium support & SLA",
    ],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 gap-2 border-border/70 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Now available · TTCN-3 Release 18 test suites
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Cloud-based <span className="text-gradient-brand">3GPP UE</span> certification platform
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Build your UE anywhere in the world. Connect securely to AEON Cloud. Run TTCN-3 certification on real SDR hardware and receive AI-powered debugging reports.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register"><Button size="lg" className="gap-2">Start free trial <ArrowRight className="size-4" /></Button></Link>
              <Button size="lg" variant="outline">Request demo</Button>
              <Button size="lg" variant="ghost">Book technical meeting</Button>
            </div>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-8 border-t border-border/60 pt-8 text-left">
              {[
                { k: "3GPP", v: "Rel 15 – 18" },
                { k: "Uptime", v: "99.95% SLA" },
                { k: "Regions", v: "EU · US · APAC" },
              ].map((s) => (
                <div key={s.k}>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.k}</p>
                  <p className="mt-1 text-lg font-semibold">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mock terminal / dashboard preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
              <div className="flex items-center justify-between border-b border-border/60 bg-secondary/40 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/70" />
                  <span className="size-2.5 rounded-full bg-warning/70" />
                  <span className="size-2.5 rounded-full bg-success/70" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground">aeon-cloud · execution #4821</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">tester-eu-03 · Release 18</span>
              </div>
              <div className="grid gap-0 md:grid-cols-[1fr_1.4fr]">
                <div className="border-b border-border/60 p-4 font-mono text-xs md:border-b-0 md:border-r">
                  <p className="text-muted-foreground">▸ Reserved tester eu-03 (LimeSDR + B210)</p>
                  <p className="text-muted-foreground">▸ Flashed build v2.4.1-rc3</p>
                  <p className="text-muted-foreground">▸ Loaded campaign NR_5GS_Registration</p>
                  <p className="mt-2 text-success">✓ TC_6_1_1_1  Initial Registration           PASS  1.2s</p>
                  <p className="text-success">✓ TC_6_1_1_2  Mobility Registration          PASS  0.9s</p>
                  <p className="text-success">✓ TC_6_1_1_3  Periodic Registration          PASS  1.4s</p>
                  <p className="text-destructive">✗ TC_6_1_1_4  Emergency Registration        FAIL  2.1s</p>
                  <p className="text-warning">◐ TC_6_1_1_5  Deregistration UE-init         RUNNING</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Bot className="size-4 text-primary" />
                    <span className="font-medium">AI Copilot</span>
                    <Badge variant="secondary" className="ml-auto font-mono text-[10px]">TS 38.523-1</Badge>
                  </div>
                  <div className="mt-3 rounded-md bg-secondary/40 p-3 text-sm">
                    <p className="text-muted-foreground">Why did TC_6_1_1_4 fail?</p>
                  </div>
                  <div className="mt-2 rounded-md border border-border/60 bg-background/40 p-3 text-sm leading-relaxed">
                    The UE sent <span className="font-mono text-primary">REGISTRATION REQUEST</span> without the
                    5GS mobile identity IE set to <span className="font-mono">SUCI</span> for the emergency
                    registration type. Per <span className="font-mono">TS 24.501 §5.5.1.2.2</span>, an emergency
                    registration shall include a SUCI or a limited SUCI. Suggested fix in
                    <span className="font-mono"> nas_mm.c:1284</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY / LOGO BAR */}
      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by modem teams shipping to Rel 15 – 18
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center text-sm font-semibold tracking-tight text-muted-foreground md:grid-cols-6">
            {["ARIA SEMI", "NORDWAVE", "TELCOMET", "OCTA MODEM", "MERIDIAN RF", "KYONEX"].map((n) => (
              <span key={n} className="font-mono opacity-70">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY AEON — comparison teaser */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Why AEON Cloud</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Chamber-grade coverage. Cloud economics.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Traditional protocol conformance rigs like Anritsu ME7834NR and R&amp;S TS-RRM deliver excellent 3GPP coverage — starting at seven figures of CAPEX and weeks of provisioning. AEON Cloud delivers the same coverage on demand, on OpEx, with an AI Copilot built in.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/platform"><Button variant="outline">See platform</Button></Link>
                <Link href="/pricing"><Button variant="ghost">View pricing</Button></Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Capability</th>
                    <th className="px-4 py-2.5 font-medium text-primary">AEON Cloud</th>
                    <th className="px-4 py-2.5 font-medium">Chamber system</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Model", "Cloud · OpEx", "CAPEX $1M+"],
                    ["Provisioning", "Minutes", "Weeks – months"],
                    ["Debug", "AI Copilot", "Manual"],
                    ["CI / CD", "Native REST", "Custom scripts"],
                  ].map((r) => (
                    <tr key={r[0]} className="border-t border-border/60">
                      <td className="px-4 py-2.5 font-medium">{r[0]}</td>
                      <td className="px-4 py-2.5">{r[1]}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Platform</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Everything a modem team needs, in one managed cloud
            </h2>
            <p className="mt-4 text-muted-foreground">
              AEON Cloud pairs a customer portal with our physical TTCN-3 testers. Think GitHub Actions —
              but for 3GPP conformance on real SDR hardware.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-primary/40 hover:bg-card">
                <div className="grid size-9 place-items-center rounded-md border border-border/70 bg-secondary/60 text-primary">
                  <f.icon className="size-4.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                From commit to certification in six steps
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              AEON Cloud never emulates the tester. Every run executes on physical AEON TTCN-3 infrastructure
              (LimeSDR, Ettus B210) in a scheduled lab.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((w) => (
              <div key={w.step} className="rounded-xl border border-border/70 bg-card p-6">
                <p className="font-mono text-xs text-primary">{w.step}</p>
                <h3 className="mt-3 text-base font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Plans that scale with your certification program
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start free. Upgrade when you're ready for dedicated hardware and premium support.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={
                  "relative rounded-xl border p-6 " +
                  (p.highlight
                    ? "border-primary/50 bg-card shadow-[var(--shadow-elevated)]"
                    : "border-border/70 bg-card/60")
                }
              >
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

      {/* CTA */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="flex justify-center gap-3 text-primary">
            <Terminal className="size-5" />
            <Workflow className="size-5" />
            <Lock className="size-5" />
            <Zap className="size-5" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
            Ship certified UEs faster
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join chipset vendors and OEMs using AEON Cloud to shorten certification cycles from months to days.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register"><Button size="lg">Start free trial</Button></Link>
            <Button size="lg" variant="outline">Talk to an engineer</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
