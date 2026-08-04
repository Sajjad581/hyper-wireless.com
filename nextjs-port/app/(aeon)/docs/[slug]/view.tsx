"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@aeon/components/ui/badge";
import { Button } from "@aeon/components/ui/button";
import { SiteNav } from "@aeon/components/marketing/site-nav";
import { SiteFooter } from "@aeon/components/marketing/site-footer";
import { DocBlocks } from "@aeon/components/marketing/doc-blocks";
import { docNeighbours, docsByGroup, getDocPage, type DocPage } from "@aeon/lib/docs";

function DocNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">That documentation page does not exist or has been moved.</p>
        <Link href="/docs" className="mt-6 inline-block"><Button variant="outline">Back to documentation</Button></Link>
      </div>
      <SiteFooter />
    </div>
  );
}

export default function DocArticle({ page, prev, next }: { page: DocPage; prev?: DocPage; next?: DocPage }) {
  const groups = docsByGroup();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-12">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <Link href="/docs" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3" /> All documentation
            </Link>
            <nav className="mt-5 space-y-5">
              {groups.map((g) => (
                <div key={g.group}>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{g.group}</p>
                  <ul className="mt-2 space-y-0.5">
                    {g.pages.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/docs/${p.slug}`}
                          className="block rounded-md px-2 py-1 text-[13px] leading-5 text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0 flex-1">
          <Badge variant="outline" className="border-border/70 bg-card/50 text-xs text-muted-foreground">{page.group}</Badge>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{page.description}</p>
          <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" /> {page.readMinutes} min read
          </p>

          <div className="mt-10 max-w-3xl">
            <DocBlocks blocks={page.blocks} />
          </div>

          <div className="mt-14 max-w-3xl rounded-xl border border-border/70 bg-card/60 p-6">
            <p className="text-sm font-medium">Run this against a real SDR lane</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The tester is a service, not a box. Push a build, reserve a lane, get a verdict.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/register"><Button size="sm">Start free trial</Button></Link>
              <Link href={`/docs/${"quickstart"}`} ><Button size="sm" variant="outline">Quickstart</Button></Link>
            </div>
          </div>

          <div className="mt-10 flex max-w-3xl flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
            {prev ? (
              <Link href={`/docs/${prev.slug}`} className="group text-sm">
                <span className="text-xs text-muted-foreground">Previous</span>
                <span className="mt-0.5 flex items-center gap-1 font-medium group-hover:text-primary">
                  <ArrowLeft className="size-3" /> {prev.title}
                </span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/docs/${next.slug}`} className="group text-sm sm:text-right">
                <span className="text-xs text-muted-foreground">Next</span>
                <span className="mt-0.5 flex items-center gap-1 font-medium group-hover:text-primary sm:justify-end">
                  {next.title} <ArrowRight className="size-3" />
                </span>
              </Link>
            ) : null}
          </div>
        </article>
      </div>

      <SiteFooter />
    </div>
  );
}
