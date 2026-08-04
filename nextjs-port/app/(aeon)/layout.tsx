import type { Metadata } from "next";
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
      "@id": `${SITE_URL}/#organization`,
      name: "AEON Cloud",
      url: SITE_URL,
      description:
        "Cloud-based 3GPP UE certification platform. A digital testbench for TTCN-3 conformance on SDR-backed lanes.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AEON Cloud",
      publisher: { "@id": `${SITE_URL}/#organization` },
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
