"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@aeon/components/ui/badge";
import { Button } from "@aeon/components/ui/button";
import { SiteNav } from "@aeon/components/marketing/site-nav";
import { SiteFooter } from "@aeon/components/marketing/site-footer";
import { getPost, posts, relatedPosts, type BlogPost, type BlogSection } from "@aeon/lib/blog/posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">The article you are looking for does not exist or has been moved.</p>
        <Link href="/blog" className="mt-6 inline-block"><Button variant="outline">Back to blog</Button></Link>
      </div>
      <SiteFooter />
    </div>
  );
}

export default function BlogArticle({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <article>
        <header className="border-b border-border/60">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3" /> All articles
            </Link>
            <Badge variant="outline" className="mt-6 border-border/70 bg-card/50 text-xs text-muted-foreground">{post.category}</Badge>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><User className="size-3" /> {post.author}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {post.readMinutes} min read</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6">
          <div className="mt-8 overflow-hidden rounded-xl border border-border/70">
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1024}
              height={1024}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="space-y-10">
            {post.sections.map((section: BlogSection, i: number) => (
              <section key={i} className="space-y-4">
                {section.heading ? (
                  <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
                ) : null}
                {section.paragraphs.map((para: string, j: number) => (
                  <p key={j} className="text-[15px] leading-7 text-foreground/85">
                    {para}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-7 text-foreground/85">
                    {section.bullets.map((b: string) => <li key={b}>{b}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-border/70 bg-card/60 p-6">
            <p className="text-sm font-medium">Ready to run this on a browser-accessed tester?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No box. No rack. No shipping crate. Just a build, a browser, and a verdict.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/register"><Button size="sm">Start free trial</Button></Link>
              <Link href="/platform"><Button size="sm" variant="outline">Explore the platform</Button></Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border/60 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="text-xl font-semibold tracking-tight">Continue reading</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((p: BlogPost) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <div className="aspect-[16/10] overflow-hidden border-b border-border/60">
                    <img src={p.image} alt={p.imageAlt} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <Badge variant="outline" className="w-fit border-border/70 bg-secondary/40 text-[10px]">{p.category}</Badge>
                    <h3 className="text-base font-semibold leading-snug">{p.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs text-primary">
                      Read <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {/* silence unused import warning for posts */}
            <span className="hidden">{posts.length}</span>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </div>
  );
}
