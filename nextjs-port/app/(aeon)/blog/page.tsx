import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Blog — AEON Cloud" },
      { name: "description", content: "Field notes from AEON Cloud on 3GPP UE certification, TTCN-3, SDR-backed testing, AI-assisted debugging, and moving telecom conformance out of the chamber and into the browser." },
      { property: "og:title", content: "Blog — AEON Cloud" },
      { property: "og:description", content: "3GPP UE certification, TTCN-3, SDR testing, AI copilot, and the shift from physical testers to browser-accessed digital labs." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog — AEON Cloud" },
      { name: "twitter:description", content: "3GPP UE certification, TTCN-3, SDR, AI copilot, and the shift from physical testers to browser-accessed digital labs." },
    ]);

export default function Page() {
  return <View />;
}
