import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: "Pricing — AEON Cloud" },
      { name: "description", content: "Transparent pricing for 3GPP UE certification. Free Developer tier, Startup at $1,490/mo, and Enterprise with dedicated SDR pools, SSO, and 24/7 SLA." },
      { property: "og:title", content: "Pricing — AEON Cloud" },
      { property: "og:description", content: "Plans that scale with your certification program. Developer (free), Startup ($1,490/mo), Enterprise (custom)." },
      { property: "og:url", content: "https://aeon-cloud-connect.lovable.app/pricing" },
      { name: "twitter:title", content: "Pricing — AEON Cloud" },
      { name: "twitter:description", content: "Free Developer tier, Startup at $1,490/mo, custom Enterprise for chipset vendors and OEMs." },
    ]);

export default function Page() {
  return <View />;
}
