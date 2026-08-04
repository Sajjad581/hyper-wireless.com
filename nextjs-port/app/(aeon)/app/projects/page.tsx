import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Projects — AEON Cloud' },
      { name: "description", content: 'Manage 3GPP UE certification projects, test suites, and target release configurations in AEON Cloud.' },
      { property: "og:title", content: 'Projects — AEON Cloud' },
      { property: "og:description", content: 'Manage 3GPP UE certification projects, test suites, and target release configurations in AEON Cloud.' },
      { name: "twitter:title", content: 'Projects — AEON Cloud' },
      { name: "twitter:description", content: 'Manage 3GPP UE certification projects, test suites, and target release configurations in AEON Cloud.' },
    ]);

export default function Page() {
  return <View />;
}
