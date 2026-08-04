import type { Metadata } from "next";

export const SITE_URL = "https://aeon-cloud-connect.lovable.app";

type Tag = { title?: string; name?: string; property?: string; content?: string; charSet?: string };

/**
 * Converts the TanStack `head().meta` tag list used by the original project
 * into a Next.js Metadata object, so route metadata stays copy-paste portable.
 */
export function metadataFromTags(tags: Tag[]): Metadata {
  const meta: Metadata = { openGraph: {}, twitter: {} };
  const og = meta.openGraph as Record<string, unknown>;
  const tw = meta.twitter as Record<string, unknown>;

  for (const tag of tags) {
    if (tag.title) meta.title = tag.title;
    const content = tag.content;
    if (!content) continue;
    switch (tag.name ?? tag.property) {
      case "description":
        meta.description = content;
        break;
      case "keywords":
        meta.keywords = content.split(",").map((k) => k.trim());
        break;
      case "robots":
        meta.robots = content;
        break;
      case "og:title":
        og.title = content;
        break;
      case "og:description":
        og.description = content;
        break;
      case "og:type":
        og.type = content;
        break;
      case "og:url":
        og.url = content;
        break;
      case "og:image":
        og.images = [content];
        break;
      case "twitter:card":
        tw.card = content;
        break;
      case "twitter:title":
        tw.title = content;
        break;
      case "twitter:description":
        tw.description = content;
        break;
      case "twitter:image":
        tw.images = [content];
        break;
      default:
        break;
    }
  }
  if (!Object.keys(og).length) delete meta.openGraph;
  if (!Object.keys(tw).length) delete meta.twitter;
  return meta;
}
