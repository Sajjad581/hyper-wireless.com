import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "AEON TTCN Engine — AEON Cloud" },
      { name: "description", content: "Architecture of the AEON TTCN-3 execution engine: scheduler, protocol stack, Jenkins integration, artifact store, and replay engine." },
      { property: "og:title", content: "AEON TTCN Engine — AEON Cloud" },
      { property: "og:description", content: "Behind the AEON TTCN-3 execution engine." },
    ]);

export default function Page() {
  return <View />;
}
