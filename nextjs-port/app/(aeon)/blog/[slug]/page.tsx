import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, posts, relatedPosts } from "@aeon/lib/blog/posts";
import { SITE_URL } from "@aeon/lib/seo";
import BlogArticle from "./view";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found — AEON Cloud", robots: { index: false } };
  const url = `${SITE_URL}/blog/${slug}`;
  const image = `${SITE_URL}${post.image}`;
  return {
    title: `${post.title} — AEON Cloud`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, type: "article", url, images: [image] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    image: `${SITE_URL}${post.image}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogArticle post={post} related={relatedPosts(slug, 3)} />
    </>
  );
}
