import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Billing & Usage — AEON Cloud' },
      { name: "description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
      { property: "og:title", content: 'Billing & Usage — AEON Cloud' },
      { property: "og:description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
      { name: "twitter:title", content: 'Billing & Usage — AEON Cloud' },
      { name: "twitter:description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
    ]);

export default function Page() {
  return <View />;
}
