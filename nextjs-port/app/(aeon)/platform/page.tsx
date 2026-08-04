import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Platform — AEON Cloud" },
      { name: "description", content: "AEON Cloud unifies TTCN-3 test execution, SDR-based radio infrastructure, build storage, and an AI Telecom Copilot for 3GPP UE certification — delivered as a managed cloud." },
      { property: "og:title", content: "Platform — AEON Cloud" },
      { property: "og:description", content: "The managed cloud stack for 3GPP UE certification: TTCN-3 runner, SDR test lanes, build repository, live execution monitor, and AI Telecom Copilot." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/platform" },
      { name: "twitter:title", content: "Platform — AEON Cloud" },
      { name: "twitter:description", content: "Managed cloud TTCN-3 testing, SDR lanes, build storage, and an AI Telecom Copilot for 3GPP UE certification." },
    ]);

export default function Page() {
  return <View />;
}
