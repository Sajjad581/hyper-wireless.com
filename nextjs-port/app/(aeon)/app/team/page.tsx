import type { Metadata } from "next";
import { metadataFromTags } from "@aeon/lib/seo";

import View from "./view";

export const metadata: Metadata = metadataFromTags([
      { title: 'Team & Roles — AEON Cloud' },
      { name: "description", content: 'Invite engineers, assign roles, and manage RBAC access to your AEON Cloud workspace.' },
      { property: "og:title", content: 'Team & Roles — AEON Cloud' },
      { property: "og:description", content: 'Invite engineers, assign roles, and manage RBAC access to your AEON Cloud workspace.' },
      { name: "twitter:title", content: 'Team & Roles — AEON Cloud' },
      { name: "twitter:description", content: 'Invite engineers, assign roles, and manage RBAC access to your AEON Cloud workspace.' },
    ]);

export default function Page() {
  return <View />;
}
