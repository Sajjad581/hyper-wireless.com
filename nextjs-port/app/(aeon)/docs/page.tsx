import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";
import { docPages } from "@aeon/lib/docs";
import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Documentation — TTCN-3, srsRAN, and 3GPP Testing Guides" },
      { name: "description", content: `AEON Cloud engineering docs: install srsRAN UE, run TTCN-3 campaigns remotely, TS 38.523 test case selection, CLI, REST API, SDKs, Jenkins CI, and failure debugging. ${docPages.length} pages.` },
      { property: "og:title", content: "AEON Cloud Documentation — TTCN-3 and srsRAN Testing Guides" },
      { property: "og:description", content: "Install srsRAN UE, run TTCN-3 campaigns remotely, select TS 38.523 test cases, debug registration and RRC failures." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/docs" },
      { name: "twitter:title", content: "AEON Cloud Documentation" },
      { name: "twitter:description", content: "Engineering docs for cloud TTCN-3 conformance testing: srsRAN, TS 38.523, CLI, API, CI/CD." },
    ]);

export default function Page() {
  return <View />;
}
