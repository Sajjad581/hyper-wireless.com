import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Workspace Settings — AEON Cloud' },
      { name: "description", content: 'Configure company profile, MFA, SSO, webhooks, and workspace preferences for AEON Cloud.' },
      { property: "og:title", content: 'Workspace Settings — AEON Cloud' },
      { property: "og:description", content: 'Configure company profile, MFA, SSO, webhooks, and workspace preferences for AEON Cloud.' },
      { name: "twitter:title", content: 'Workspace Settings — AEON Cloud' },
      { name: "twitter:description", content: 'Configure company profile, MFA, SSO, webhooks, and workspace preferences for AEON Cloud.' },
    ]);

export default function Page() {
  return <View />;
}
