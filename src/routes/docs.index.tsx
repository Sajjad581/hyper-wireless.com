import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, KeyRound, Rocket, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { docPages, docsByGroup } from "@/lib/docs";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Documentation — TTCN-3, srsRAN, and 3GPP Testing Guides" },
      { name: "description", content: `AEON Cloud engineering docs: install srsRAN UE, run TTCN-3 campaigns remotely, TS 38.523 test case selection, CLI, REST API, SDKs, Jenkins CI, and failure debugging. ${docPages.length} pages.` },
      { property: "og:title", content: "AEON Cloud Documentation — TTCN-3 and srsRAN Testing Guides" },
      { property: "og:description", content: "Install srsRAN UE, run TTCN-3 campaigns remotely, select TS 38.523 test cases, debug registration and RRC failures." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/docs" },
      { name: "twitter:title", content: "AEON Cloud Documentation" },
      { name: "twitter:description", content: "Engineering docs for cloud TTCN-3 conformance testing: srsRAN, TS 38.523, CLI, API, CI/CD." },
    ],
    links: [{ rel: "canonical", href: "https://aeon-cloud-connect.lovable.app/docs" }],
  }),
  component: DocsIndex,
});

const featured = [
  { slug: "quickstart", title: "Quickstart", desc: "First TTCN-3 verdict in under 30 minutes.", tag: "7 min" },
  { slug: "install-srsran", title: "Install srsRAN UE", desc: "Build srsUE on Ubuntu and package it for a lane.", tag: "8 min" },
  { slug: "ts-38-523-test-cases", title: "TS 38.523 guide", desc: "How the NR conformance spec is structured.", tag: "10 min" },
];

function DocsIndex() {
  const groups = docsByGroup();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-5 border-border/70 bg-card/50 text-xs text-muted-foreground">
              Documentation · {docPages.length} pages
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Engineering documentation for cloud TTCN-3 conformance testing
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Install an open-source UE, connect it to a remote SDR lane, run standard 3GPP campaigns, and debug the
              failures — with no physical tester in your building.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/docs/$slug" params={{ slug: "quickstart" }}>
                <Button size="lg" className="gap-2"><Rocket className="size-4" /> Quickstart</Button>
              </Link>
              <Link to="/docs/$slug" params={{ slug: "install-srsran" }}>
                <Button size="lg" variant="outline" className="gap-2"><Terminal className="size-4" /> Install srsRAN UE</Button>
              </Link>
              <Link to="/app/tokens">
                <Button size="lg" variant="outline" className="gap-2"><KeyRound className="size-4" /> API tokens</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((f) => (
              <Link
                key={f.slug}
                to="/docs/$slug"
                params={{ slug: f.slug }}
                className="group rounded-xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold group-hover:text-primary">{f.title}</h2>
                  <Badge variant="outline" className="font-mono text-[10px]">{f.tag}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary">
                  Read <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Reference</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Browse all documentation</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <div key={g.group} className="rounded-xl border border-border/70 bg-card/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-md border border-border/70 bg-secondary/60 text-primary">
                    <BookOpen className="size-4" />
                  </div>
                  <h3 className="text-base font-semibold">{g.group}</h3>
                </div>
                <ul className="mt-4 space-y-1">
                  {g.pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/docs/$slug"
                        params={{ slug: p.slug }}
                        className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
