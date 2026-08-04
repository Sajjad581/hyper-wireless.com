import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Lock,
  PlayCircle,
  Radio,
  ScrollText,
  ServerCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow — AEON Cloud" },
      { name: "description", content: "From commit to certification in six steps. See how AEON Cloud runs a TTCN-3 campaign on real SDR hardware, streams verdicts live, and delivers a signed certification report." },
      { property: "og:title", content: "Workflow — AEON Cloud" },
      { property: "og:description", content: "Six-step 3GPP UE certification workflow — upload build, reserve tester, secure tunnel, run TTCN-3, monitor live, download report." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/workflow" },
      { name: "twitter:title", content: "Workflow — AEON Cloud" },
      { name: "twitter:description", content: "From commit to certification in six steps on AEON Cloud." },
    ],
    links: [{ rel: "canonical", href: "https://aeon-cloud-connect.lovable.app/workflow" }],
  }),
  component: WorkflowPage,
});

const steps = [
  { icon: GitBranch, step: "01", title: "Upload build", body: "Push firmware via CLI, HTTPS API, or the web. Every artifact is versioned with checksum, tag, and provenance.", cli: "aeon builds push ./ue-v2.4.1.tar.gz --tag rc3" },
  { icon: ServerCog, step: "02", title: "Reserve tester", body: "Pick a region (EU / US / APAC) and a lane (LimeSDR or Ettus B210). Booking is minutes, not weeks.", cli: "aeon lanes reserve --region eu-west-1 --sdr lime" },
  { icon: Lock, step: "03", title: "Secure tunnel", body: "Your workstation opens a mutual-TLS tunnel to the reserved lab. No inbound firewall changes required.", cli: "aeon tunnel open --lane tester-eu-03" },
  { icon: Radio, step: "04", title: "Deploy & run", body: "The lane flashes your UE and executes the selected TTCN-3 campaign against 3GPP Release 15–18 suites.", cli: "aeon exec run --suite NR_5GS_Registration" },
  { icon: PlayCircle, step: "05", title: "Monitor live", body: "Stream verdicts, MSC sequences, PCAPs, and console logs. Pause, resume, or cancel from the dashboard.", cli: "aeon exec tail --id 4821" },
  { icon: FileCheck2, step: "06", title: "Report & analyze", body: "Export PDF / CSV / JSON / XLSX with 3GPP traceability. Ask the AI Copilot why a testcase failed.", cli: "aeon reports export 4821 --format pdf" },
];

const personas = [
  { title: "Protocol engineer", body: "Iterate on NAS / RRC / PDCP fixes with a shared tester pool and live MSCs.", icon: Radio },
  { title: "Validation engineer", body: "Run TTCN-3 campaigns across Release 15–18 with reproducible verdicts.", icon: CheckCircle2 },
  { title: "Certification manager", body: "Track coverage, verdicts, and clause traceability across builds.", icon: ScrollText },
  { title: "Engineering leadership", body: "Certification cycles compressed from months to days, on OpEx.", icon: Bot },
];

function WorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-5 border-border/70 bg-card/50 text-xs text-muted-foreground">Workflow</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              From commit to certification in six steps
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Every run on AEON Cloud executes on physical TTCN-3 infrastructure — LimeSDR and Ettus B210 lanes
              inside shielded enclosures. Nothing is emulated. Nothing is faked.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <ol className="space-y-4">
            {steps.map((s) => (
              <li key={s.step} className="grid gap-4 rounded-xl border border-border/70 bg-card/60 p-6 md:grid-cols-[auto_1fr_1.2fr] md:items-center">
                <div className="flex items-center gap-4">
                  <div className="grid size-11 place-items-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-primary">STEP {s.step}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
                <div className="overflow-hidden rounded-md border border-border/70 bg-background/60">
                  <div className="border-b border-border/60 bg-secondary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    aeon CLI
                  </div>
                  <pre className="overflow-x-auto p-3 font-mono text-xs text-foreground/90">
                    <span className="text-muted-foreground">$ </span>{s.cli}
                  </pre>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Who uses this workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">One flow, four roles</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {personas.map((p) => (
              <div key={p.title} className="rounded-xl border border-border/70 bg-card p-6">
                <p.icon className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to run your first campaign?</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button size="lg" className="gap-2">Create free workspace <ArrowRight className="size-4" /></Button></Link>
            <Link to="/docs"><Button size="lg" variant="outline">Read the quickstart</Button></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
