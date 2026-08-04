import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Testing — AEON Cloud" },
      { name: "description", content: "TTCN-3 test catalog, campaign manager, execution queue, live execution monitor, historical builds, coverage analytics, and physical lab infrastructure." },
      { property: "og:title", content: "Testing — AEON Cloud" },
      { property: "og:description", content: "TTCN-3 catalog, campaigns, live executions, coverage, and lab infrastructure." },
    ]);

export default function Page() {
  return <View />;
}
