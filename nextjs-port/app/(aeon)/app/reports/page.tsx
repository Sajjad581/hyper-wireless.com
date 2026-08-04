import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Certification Reports — AEON Cloud' },
      { name: "description", content: 'Download signed certification reports, verdict summaries, and compliance evidence for regulatory submission.' },
      { property: "og:title", content: 'Certification Reports — AEON Cloud' },
      { property: "og:description", content: 'Download signed certification reports, verdict summaries, and compliance evidence for regulatory submission.' },
      { name: "twitter:title", content: 'Certification Reports — AEON Cloud' },
      { name: "twitter:description", content: 'Download signed certification reports, verdict summaries, and compliance evidence for regulatory submission.' },
    ]);

export default function Page() {
  return <View />;
}
