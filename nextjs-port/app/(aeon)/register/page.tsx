import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Create account — AEON Cloud" },
      { name: "description", content: "Create an AEON Cloud workspace to run 3GPP UE certification on real SDR hardware. 14-day trial, no credit card required." },
      { property: "og:title", content: "Create account — AEON Cloud" },
      { property: "og:description", content: "Start a 14-day AEON Cloud trial. Managed TTCN-3 test execution, AI Copilot, and signed certification reports." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/register" },
      { name: "twitter:title", content: "Create account — AEON Cloud" },
      { name: "twitter:description", content: "Create a free AEON Cloud workspace. No credit card required." },
    ]);

export default function Page() {
  return <View />;
}
