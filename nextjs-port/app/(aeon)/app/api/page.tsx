import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "API & SDK — AEON Cloud" },
      { name: "description", content: "REST API reference, aeon-cli command guide, and official SDKs (Python, C++, JavaScript) for AEON Cloud." },
      { property: "og:title", content: "API & SDK — AEON Cloud" },
      { property: "og:description", content: "REST API, CLI, and SDKs for AEON Cloud." },
    ]);

export default function Page() {
  return <View />;
}
