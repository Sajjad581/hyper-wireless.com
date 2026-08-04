import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Engineering Dashboard — AEON Cloud" },
      { name: "description", content: "Live engineering overview: active projects, connected UEs, tester availability, running campaigns, recent builds, and AI recommendations." },
      { property: "og:title", content: "Engineering Dashboard — AEON Cloud" },
      { property: "og:description", content: "Live engineering overview across projects, testers, builds, and AI-assisted validation." },
    ]);

export default function Page() {
  return <View />;
}
