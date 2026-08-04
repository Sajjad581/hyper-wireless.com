import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'API Tokens — AEON Cloud' },
      { name: "description", content: 'Generate and revoke API tokens for CI/CD integration with AEON Cloud test infrastructure.' },
      { property: "og:title", content: 'API Tokens — AEON Cloud' },
      { property: "og:description", content: 'Generate and revoke API tokens for CI/CD integration with AEON Cloud test infrastructure.' },
      { name: "twitter:title", content: 'API Tokens — AEON Cloud' },
      { name: "twitter:description", content: 'Generate and revoke API tokens for CI/CD integration with AEON Cloud test infrastructure.' },
    ]);

export default function Page() {
  return <View />;
}
