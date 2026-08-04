import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Sign in — AEON Cloud' },
      { name: "description", content: 'Sign in to AEON Cloud to run 3GPP UE certification campaigns on managed cloud test infrastructure.' },
      { property: "og:title", content: 'Sign in — AEON Cloud' },
      { property: "og:description", content: 'Sign in to AEON Cloud to run 3GPP UE certification campaigns on managed cloud test infrastructure.' },
      { name: "twitter:title", content: 'Sign in — AEON Cloud' },
      { name: "twitter:description", content: 'Sign in to AEON Cloud to run 3GPP UE certification campaigns on managed cloud test infrastructure.' },
    ]);

export default function Page() {
  return <View />;
}
