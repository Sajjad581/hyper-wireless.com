import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Documentation — AEON Cloud" },
      { name: "description", content: "Getting started, architecture, testing workflow, CLI/SDK guides, API reference, tutorials, and knowledge base for AEON Cloud." },
      { property: "og:title", content: "Documentation — AEON Cloud" },
      { property: "og:description", content: "Guides, tutorials, and reference for AEON Cloud." },
    ]);

export default function Page() {
  return <View />;
}
