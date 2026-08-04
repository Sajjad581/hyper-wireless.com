import { createFileRoute } from "@tanstack/react-router";
import { Search, BookOpen, Terminal, Code2, Rocket, Wrench, GitBranch, Layers } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — AEON Cloud" },
      { name: "description", content: "Getting started, architecture, testing workflow, CLI/SDK guides, API reference, tutorials, and knowledge base for AEON Cloud." },
      { property: "og:title", content: "Documentation — AEON Cloud" },
      { property: "og:description", content: "Guides, tutorials, and reference for AEON Cloud." },
    ],
  }),
  component: DocsPage,
});

const sections = [
  { title: "Getting Started", icon: Rocket, items: ["Installation", "Quick Start", "Architecture", "Testing Workflow"] },
  { title: "Guides", icon: BookOpen, items: ["User Guide", "Administrator Guide", "CLI Guide", "SDK Guide"] },
  { title: "Reference", icon: Code2, items: ["REST API Reference", "CLI Reference", "SDK Reference", "Webhook Reference"] },
  { title: "Operations", icon: Wrench, items: ["Troubleshooting", "FAQ", "Release Notes", "Migration Guides"] },
  { title: "Tutorials", icon: Layers, items: ["First TTCN-3 campaign", "CI/CD with GitHub Actions", "Jenkins integration", "Regression pipeline"] },
  { title: "Knowledge Base", icon: GitBranch, items: ["3GPP procedure catalog", "TTCN-3 patterns", "SDR calibration", "Modem debugging"] },
];

const featured = [
  { title: "Quick Start", desc: "Run your first campaign in 5 minutes with the CLI.", tag: "5 min" },
  { title: "Architecture", desc: "How the scheduler, TTCN engine, and lab fabric fit together.", tag: "10 min" },
  { title: "CI/CD Integration", desc: "Wire aeon-cli into GitHub Actions or Jenkins pipelines.", tag: "8 min" },
];

function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Documentation" description="Everything you need to build, test, and ship on AEON Cloud." />

      <div className="rounded-xl border border-border/70 bg-card p-6">
        <div className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search 3,240 articles, API endpoints, and examples…" className="h-11 pl-9 text-sm" />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border/70 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
        </div>
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap gap-1.5">
          {["3gpp", "ttcn-3", "cli", "webhooks", "sdk", "jenkins", "coverage", "reports"].map((t) => (
            <Badge key={t} variant="secondary" className="font-mono text-[10px]">#{t}</Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {featured.map((f) => (
          <a key={f.title} href="#" className="group rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold group-hover:text-primary">{f.title}</h3>
              <Badge variant="outline" className="font-mono text-[10px]">{f.tag}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-md bg-primary/15 text-primary"><s.icon className="size-4" /></div>
              <h3 className="text-sm font-semibold">{s.title}</h3>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              {s.items.map((i) => (
                <li key={i}><a href="#" className="text-muted-foreground hover:text-foreground">→ {i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-5">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Quickstart</h3>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`# 1. Install the CLI
curl -fsSL https://install.aeon.cloud | sh

# 2. Authenticate
aeon login

# 3. Initialize a project
aeon init --release r17 --chipset qualcomm-x75

# 4. Upload a build and run
aeon upload ./build/ue-firmware.tar.zst
aeon run --campaign smoke --wait
aeon report --format pdf --output ./cert.pdf`}
        </pre>
      </div>
    </div>
  );
}
