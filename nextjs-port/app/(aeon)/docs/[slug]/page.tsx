import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docNeighbours, docPages, getDocPage } from "@aeon/lib/docs";
import { SITE_URL } from "@aeon/lib/seo";
import DocArticle from "./view";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return docPages.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) return { title: "Page not found — AEON Cloud docs", robots: { index: false } };
  const url = `${SITE_URL}/docs/${slug}`;
  return {
    title: `${page.title} — AEON Cloud docs`,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.description, type: "article", url },
    twitter: { title: page.title, description: page.description },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();
  const { prev, next } = docNeighbours(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.description,
    keywords: page.keywords.join(", "),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DocArticle page={page} prev={prev} next={next} />
    </>
  );
}
