import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Build Repository — AEON Cloud' },
      { name: "description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
      { property: "og:title", content: 'Build Repository — AEON Cloud' },
      { property: "og:description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
      { name: "twitter:title", content: 'Build Repository — AEON Cloud' },
      { name: "twitter:description", content: 'Versioned firmware and UE build storage with checksums, tags, and deployment status for TTCN-3 test campaigns.' },
    ]);

export default function Page() {
  return <View />;
}
