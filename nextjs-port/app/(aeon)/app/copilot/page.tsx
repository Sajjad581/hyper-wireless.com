import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'AI Telecom Copilot — AEON Cloud' },
      { name: "description", content: 'Ask a 3GPP-aware AI copilot about TTCN-3 failures, protocol clauses, and modem debugging in AEON Cloud.' },
      { property: "og:title", content: 'AI Telecom Copilot — AEON Cloud' },
      { property: "og:description", content: 'Ask a 3GPP-aware AI copilot about TTCN-3 failures, protocol clauses, and modem debugging in AEON Cloud.' },
      { name: "twitter:title", content: 'AI Telecom Copilot — AEON Cloud' },
      { name: "twitter:description", content: 'Ask a 3GPP-aware AI copilot about TTCN-3 failures, protocol clauses, and modem debugging in AEON Cloud.' },
    ]);

export default function Page() {
  return <View />;
}
