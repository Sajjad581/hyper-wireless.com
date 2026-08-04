import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Workflow — AEON Cloud" },
      { name: "description", content: "From commit to certification in six steps. See how AEON Cloud runs a TTCN-3 campaign on real SDR hardware, streams verdicts live, and delivers a signed certification report." },
      { property: "og:title", content: "Workflow — AEON Cloud" },
      { property: "og:description", content: "Six-step 3GPP UE certification workflow — upload build, reserve tester, secure tunnel, run TTCN-3, monitor live, download report." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/workflow" },
      { name: "twitter:title", content: "Workflow — AEON Cloud" },
      { name: "twitter:description", content: "From commit to certification in six steps on AEON Cloud." },
    ]);

export default function Page() {
  return <View />;
}
