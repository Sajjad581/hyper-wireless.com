import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { posts } from "@/lib/blog/posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — AEON Cloud" },
      { name: "description", content: "Field notes from AEON Cloud on 3GPP UE certification, TTCN-3, SDR-backed testing, AI-assisted debugging, and moving telecom conformance out of the chamber and into the browser." },
      { property: "og:title", content: "Blog — AEON Cloud" },
      { property: "og:description", content: "3GPP UE certification, TTCN-3, SDR testing, AI copilot, and the shift from physical testers to browser-accessed digital labs." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog — AEON Cloud" },
      { name: "twitter:description", content: "3GPP UE certification, TTCN-3, SDR, AI copilot, and the shift from physical testers to browser-accessed digital labs." },
    ],
    links: [{ rel: "canonical", href: "https://aeon-cloud-connect.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function BlogIndex() {
  const [featured, ...rest] = posts;
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Badge variant="outline" className="mb-5 border-border/70 bg-card/50 text-xs text-muted-foreground">Blog</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Field notes from the digital testbench
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Long-form writing on 3GPP UE certification, TTCN-3, SDR-backed testing, AI-assisted debugging,
            and the shift from shipped hardware testers to browser-accessed digital labs.
          </p>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group grid gap-8 overflow-hidden rounded-xl border border-border/70 bg-card md:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="border-border/70 bg-secondary/40">{featured.category}</Badge>
                <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {formatDate(featured.date)}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {featured.readMinutes} min read</span>
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-primary">Read article <ArrowRight className="size-4" /></span>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-border/60">
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="border-border/70 bg-secondary/40 text-[10px]">{p.category}</Badge>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {p.readMinutes} min</span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug">{p.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>{formatDate(p.date)}</span>
                    <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
