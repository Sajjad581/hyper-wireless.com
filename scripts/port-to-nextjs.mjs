/**
 * Generates a Next.js (App Router) port of the AEON Cloud site into `nextjs-port/`.
 * Run: bun scripts/port-to-nextjs.mjs
 *
 * Output layout (copy into your existing Next.js app):
 *   aeon/                -> shared components, hooks, lib, styles  (alias @aeon/*)
 *   app/(aeon)/...       -> route group with every page
 *   app/sitemap.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "nextjs-port");
const APP = path.join(OUT, "app", "(aeon)");
const AEON = path.join(OUT, "aeon");

fs.rmSync(OUT, { recursive: true, force: true });

const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ------------------------------------------------------------------ *
 * Shared source transforms
 * ------------------------------------------------------------------ */

// <Link to="/docs/$slug" params={{ slug: p.slug }}> -> <Link href={`/docs/${p.slug}`}>
function transformLinkTags(src) {
  let out = "";
  let i = 0;
  while (true) {
    const start = src.indexOf("<Link", i);
    if (start === -1) {
      out += src.slice(i);
      break;
    }
    // find end of the opening tag, ignoring `>` inside braces or quotes
    let j = start;
    let depth = 0;
    let quote = null;
    for (; j < src.length; j++) {
      const c = src[j];
      if (quote) {
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") quote = c;
      else if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) break;
    }
    let tag = src.slice(start, j + 1);

    const paramsMatch = tag.match(/params=\{\{([^}]*)\}\}/);
    if (paramsMatch) {
      const params = {};
      for (const pair of paramsMatch[1].split(",")) {
        const idx = pair.indexOf(":");
        if (idx === -1) continue;
        params[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
      }
      tag = tag.replace(/params=\{\{[^}]*\}\}\s*/, "");
      tag = tag.replace(/to=(["'])([^"']+)\1/, (_m, _q, route) => {
        const templated = route.replace(/\$([A-Za-z0-9_]+)/g, (_mm, key) =>
          params[key] ? "${" + params[key] + "}" : "${" + key + "}",
        );
        return "href={`" + templated + "`}";
      });
    }
    tag = tag.replace(/(\s)to=/g, "$1href=");
    out += src.slice(i, start) + tag;
    i = j + 1;
  }
  return out;
}

function transformShared(src, { clientDirective = false } = {}) {
  let s = src;

  s = transformLinkTags(s);

  // drop router-only props
  s = s.replace(/\s*(active|inactive)Props=\{\{[^}]*\}\}/g, "");
  s = s.replace(/\s*activeOptions=\{\{[^}]*\}\}/g, "");
  s = s.replace(/\s*preload=(["'])[^"']*\1/g, "");

  // TanStack Router imports -> next
  s = s.replace(
    /import\s*\{[^}]*\}\s*from\s*["']@tanstack\/react-router["'];?\n?/g,
    (m) => {
      const names = m.match(/\{([^}]*)\}/)[1].split(",").map((x) => x.trim());
      const lines = [];
      if (names.includes("Link")) lines.push('import Link from "next/link";');
      if (names.includes("useRouterState")) lines.push('import { usePathname } from "next/navigation";');
      if (names.includes("useNavigate") || names.includes("useRouter"))
        lines.push('import { useRouter } from "next/navigation";');
      return lines.length ? lines.join("\n") + "\n" : "";
    },
  );

  // useRouterState({ select: r => r.location.pathname }) -> usePathname()
  s = s.replace(/useRouterState\(\{[^}]*\}[^)]*\)/g, "usePathname()");
  s = s.replace(/useRouterState\([\s\S]*?\}\s*\)/g, "usePathname()");

  // useNavigate -> next router
  s = s.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
  s = s.replace(/navigate\(\{\s*to:\s*(["'][^"']+["'])\s*\}\)/g, "router.push($1)");

  // path alias
  s = s.replace(/(["'])@\//g, "$1@aeon/");

  if (clientDirective && !s.startsWith('"use client"')) s = '"use client";\n\n' + s;
  return s;
}

/* ------------------------------------------------------------------ *
 * 1. Copy shared code (components, hooks, lib, styles)
 * ------------------------------------------------------------------ */

const SKIP = new Set(["lovable-error-reporting.ts", "error-capture.ts", "error-page.ts"]);

function copyTree(fromRel, toAbs, { clientDirective }) {
  const from = path.join(ROOT, fromRel);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      copyTree(path.join(fromRel, entry.name), path.join(toAbs, entry.name), { clientDirective });
      continue;
    }
    if (SKIP.has(entry.name)) continue;
    const src = read(path.join(fromRel, entry.name));
    write(path.join(toAbs, entry.name), transformShared(src, { clientDirective }));
  }
}

copyTree("src/components", path.join(AEON, "components"), { clientDirective: true });
copyTree("src/hooks", path.join(AEON, "hooks"), { clientDirective: true });
copyTree("src/lib", path.join(AEON, "lib"), { clientDirective: false });

/* blog hero images: Vite module imports -> /public paths */
for (const file of fs.readdirSync(path.join(ROOT, "src/assets/blog"))) {
  fs.mkdirSync(path.join(OUT, "public", "aeon-blog"), { recursive: true });
  fs.copyFileSync(
    path.join(ROOT, "src/assets/blog", file),
    path.join(OUT, "public", "aeon-blog", file),
  );
}
{
  const postsPath = path.join(AEON, "lib", "blog", "posts.ts");
  const posts = fs
    .readFileSync(postsPath, "utf8")
    .replace(
      /import\s+([A-Za-z0-9_]+)\s+from\s+["']@aeon\/assets\/blog\/([^"']+)["'];/g,
      (_m, name, file) => `const ${name} = "/aeon-blog/${file}";`,
    );
  fs.writeFileSync(postsPath, posts);
}
write(path.join(AEON, "styles", "aeon.css"), read("src/styles.css").replace('@source "../src";', '@source "../../app";\n@source "../";'));

/* ------------------------------------------------------------------ *
 * 2. Route conversion
 * ------------------------------------------------------------------ */

// Extract the `meta: [ ... ]` array literal out of a route's head()
function extractMetaArray(src) {
  const key = src.indexOf("meta: [");
  if (key === -1) return null;
  let i = src.indexOf("[", key);
  let depth = 0;
  let quote = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (quote) {
      if (c === quote && src[j - 1] !== "\\") quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(i, j + 1);
    }
  }
  return null;
}

function stripRouteExport(src) {
  const start = src.indexOf("export const Route");
  if (start === -1) return src;
  // find the terminating `});` of the createFileRoute call
  const end = src.indexOf("\n});", start);
  return (src.slice(0, start) + src.slice(end + 4)).replace(/\n{3,}/g, "\n\n");
}

function componentName(src) {
  const m = src.match(/component:\s*([A-Za-z0-9_]+)/);
  return m ? m[1] : null;
}

// Imports the metadata array depends on (e.g. `docPages.length` in a description)
function metaImports(src, meta) {
  const lines = [];
  const re = /import\s*\{([^}]*)\}\s*from\s*["'](@\/lib\/[^"']+)["'];?/g;
  let m;
  while ((m = re.exec(src))) {
    const names = m[1]
      .split(",")
      .map((n) => n.trim().replace(/^type\s+/, ""))
      .filter((n) => n && new RegExp(`\\b${n}\\b`).test(meta));
    if (names.length) lines.push(`import { ${names.join(", ")} } from "${m[2].replace("@/", "@aeon/")}";`);
  }
  return lines.join("\n");
}

const staticRoutes = [
  ["src/routes/index.tsx", "."],
  ["src/routes/platform.tsx", "platform"],
  ["src/routes/workflow.tsx", "workflow"],
  ["src/routes/pricing.tsx", "pricing"],
  ["src/routes/login.tsx", "login"],
  ["src/routes/register.tsx", "register"],
  ["src/routes/docs.index.tsx", "docs"],
  ["src/routes/blog.index.tsx", "blog"],
  ["src/routes/app.index.tsx", "app"],
  ["src/routes/app.projects.tsx", "app/projects"],
  ["src/routes/app.builds.tsx", "app/builds"],
  ["src/routes/app.testing.tsx", "app/testing"],
  ["src/routes/app.executions.tsx", "app/executions"],
  ["src/routes/app.copilot.tsx", "app/copilot"],
  ["src/routes/app.reports.tsx", "app/reports"],
  ["src/routes/app.engineering.tsx", "app/engineering"],
  ["src/routes/app.docs.tsx", "app/docs"],
  ["src/routes/app.api.tsx", "app/api"],
  ["src/routes/app.billing.tsx", "app/billing"],
  ["src/routes/app.tokens.tsx", "app/tokens"],
  ["src/routes/app.team.tsx", "app/team"],
  ["src/routes/app.settings.tsx", "app/settings"],
];

for (const [file, routeDir] of staticRoutes) {
  const src = read(file);
  const meta = extractMetaArray(src);
  const comp = componentName(src) ?? "Page";
  const dir = path.join(APP, routeDir);

  let view = transformShared(stripRouteExport(src), { clientDirective: true });
  view = view.replace(new RegExp(`function ${comp}\\(`), `export default function ${comp}(`);
  write(path.join(dir, "view.tsx"), view);

  const page = `import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";
${metaImports(src, meta ?? "")}
import View from "./view";

export const metadata: Metadata = metadataFromTags(${meta ? meta : "[]"});

export default function Page() {
  return <View />;
}
`;
  write(path.join(dir, "page.tsx"), page);
}

/* /app segment layout (sidebar + topbar shell) */
write(
  path.join(APP, "app", "layout.tsx"),
  `import { AppSidebar } from "@aeon/components/app/app-sidebar";
import { AppTopbar } from "@aeon/components/app/app-topbar";

export default function AppPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
`,
);

/* dynamic routes: /blog/[slug] and /docs/[slug] */
function dynamicRoute({ file, dir, view: viewName, propsType, bodyReplace }) {
  const src = read(file);
  let view = transformShared(stripRouteExport(src), { clientDirective: true });
  view = bodyReplace(view);
  write(path.join(APP, dir, "view.tsx"), view);
}

dynamicRoute({
  file: "src/routes/blog.$slug.tsx",
  dir: "blog/[slug]",
  bodyReplace: (v) =>
    v
      .replace(
        /function BlogArticle\(\) \{\n\s*const data = Route\.useLoaderData\(\)[^\n]*\n/,
        "export default function BlogArticle({ post, related }: { post: BlogPost; related: BlogPost[] }) {\n",
      )
      .replace(/\n\s*const \{ post, related \} = data;/, ""),
});

dynamicRoute({
  file: "src/routes/docs.$slug.tsx",
  dir: "docs/[slug]",
  bodyReplace: (v) =>
    v.replace(
      /function DocArticle\(\) \{\n\s*const \{ page, prev, next \} = Route\.useLoaderData\(\)[^\n]*\n/,
      "export default function DocArticle({ page, prev, next }: { page: DocPage; prev?: DocPage; next?: DocPage }) {\n",
    ),
});

write(
  path.join(APP, "blog/[slug]", "page.tsx"),
  `import type { Metadata } from "next";
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
  const url = \`\${SITE_URL}/blog/\${slug}\`;
  const image = \`\${SITE_URL}\${post.image}\`;
  return {
    title: \`\${post.title} — AEON Cloud\`,
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
    image: \`\${SITE_URL}\${post.image}\`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogArticle post={post} related={relatedPosts(slug, 3)} />
    </>
  );
}
`,
);

write(
  path.join(APP, "docs/[slug]", "page.tsx"),
  `import type { Metadata } from "next";
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
  const url = \`\${SITE_URL}/docs/\${slug}\`;
  return {
    title: \`\${page.title} — AEON Cloud docs\`,
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
`,
);

/* ------------------------------------------------------------------ *
 * 3. Support files
 * ------------------------------------------------------------------ */

write(
  path.join(AEON, "lib", "seo.ts"),
  `import type { Metadata } from "next";

export const SITE_URL = "https://aeon-cloud-connect.lovable.app";

type Tag = { title?: string; name?: string; property?: string; content?: string; charSet?: string };

/**
 * Converts the TanStack \`head().meta\` tag list used by the original project
 * into a Next.js Metadata object, so route metadata stays copy-paste portable.
 */
export function metadataFromTags(tags: Tag[]): Metadata {
  const meta: Metadata = { openGraph: {}, twitter: {} };
  const og = meta.openGraph as Record<string, unknown>;
  const tw = meta.twitter as Record<string, unknown>;

  for (const tag of tags) {
    if (tag.title) meta.title = tag.title;
    const content = tag.content;
    if (!content) continue;
    switch (tag.name ?? tag.property) {
      case "description":
        meta.description = content;
        break;
      case "keywords":
        meta.keywords = content.split(",").map((k) => k.trim());
        break;
      case "robots":
        meta.robots = content;
        break;
      case "og:title":
        og.title = content;
        break;
      case "og:description":
        og.description = content;
        break;
      case "og:type":
        og.type = content;
        break;
      case "og:url":
        og.url = content;
        break;
      case "og:image":
        og.images = [content];
        break;
      case "twitter:card":
        tw.card = content;
        break;
      case "twitter:title":
        tw.title = content;
        break;
      case "twitter:description":
        tw.description = content;
        break;
      case "twitter:image":
        tw.images = [content];
        break;
      default:
        break;
    }
  }
  if (!Object.keys(og).length) delete meta.openGraph;
  if (!Object.keys(tw).length) delete meta.twitter;
  return meta;
}
`,
);

write(
  path.join(APP, "providers.tsx"),
  `"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function AeonProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
`,
);

write(
  path.join(APP, "layout.tsx"),
  `import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@aeon/styles/aeon.css";
import { AeonProviders } from "./providers";
import { SITE_URL } from "@aeon/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AEON Cloud — Cloud-Based 3GPP UE Certification Platform",
  description:
    "Cloud 3GPP UE certification. Upload a build, run TTCN-3 campaigns on real SDR test lanes, and get AI-powered debugging — no physical tester required.",
  authors: [{ name: "AEON Cloud" }],
  openGraph: { siteName: "AEON Cloud", type: "website" },
  twitter: { card: "summary_large_image" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": \`\${SITE_URL}/#organization\`,
      name: "AEON Cloud",
      url: SITE_URL,
      description:
        "Cloud-based 3GPP UE certification platform. A digital testbench for TTCN-3 conformance on SDR-backed lanes.",
    },
    {
      "@type": "WebSite",
      "@id": \`\${SITE_URL}/#website\`,
      url: SITE_URL,
      name: "AEON Cloud",
      publisher: { "@id": \`\${SITE_URL}/#organization\` },
    },
  ],
};

/**
 * Route-group layout. If your existing app already owns <html>/<body>,
 * delete those tags here and keep only the <div className="dark"> wrapper.
 */
export default function AeonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark bg-background text-foreground antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <AeonProviders>{children}</AeonProviders>
    </div>
  );
}
`,
);

write(
  path.join(OUT, "app", "sitemap.ts"),
  `import type { MetadataRoute } from "next";
import { posts } from "@aeon/lib/blog/posts";
import { docPages } from "@aeon/lib/docs";
import { SITE_URL } from "@aeon/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: \`\${SITE_URL}/\`, changeFrequency: "weekly", priority: 1 },
    { url: \`\${SITE_URL}/platform\`, changeFrequency: "weekly", priority: 0.9 },
    { url: \`\${SITE_URL}/workflow\`, changeFrequency: "weekly", priority: 0.8 },
    { url: \`\${SITE_URL}/pricing\`, changeFrequency: "weekly", priority: 0.9 },
    { url: \`\${SITE_URL}/docs\`, changeFrequency: "weekly", priority: 0.8 },
    { url: \`\${SITE_URL}/blog\`, changeFrequency: "daily", priority: 0.8 },
    ...docPages.map((d) => ({
      url: \`\${SITE_URL}/docs/\${d.slug}\`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: \`\${SITE_URL}/blog/\${p.slug}\`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
`,
);

console.log("Next.js port written to nextjs-port/");
