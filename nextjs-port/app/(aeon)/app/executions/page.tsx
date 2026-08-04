import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Live Executions — AEON Cloud' },
      { name: "description", content: 'Monitor live TTCN-3 test executions with console logs, testcase status, and MSC sequence diagrams.' },
      { property: "og:title", content: 'Live Executions — AEON Cloud' },
      { property: "og:description", content: 'Monitor live TTCN-3 test executions with console logs, testcase status, and MSC sequence diagrams.' },
      { name: "twitter:title", content: 'Live Executions — AEON Cloud' },
      { name: "twitter:description", content: 'Monitor live TTCN-3 test executions with console logs, testcase status, and MSC sequence diagrams.' },
    ]);

export default function Page() {
  return <View />;
}
