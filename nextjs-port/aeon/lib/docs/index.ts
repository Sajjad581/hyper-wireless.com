import { gettingStartedPages } from "./content-getting-started";
import { openSourcePages } from "./content-open-source";
import { runningTestsPages } from "./content-running-tests";
import { cliApiPages } from "./content-cli-api";
import { cicdPages } from "./content-cicd";
import { troubleshootingPages, referencePages } from "./content-troubleshooting";
import { groupOrder, type DocGroup, type DocPage } from "./types";

export type { DocPage, DocBlock, DocGroup } from "./types";
export { groupOrder } from "./types";

export const docPages: DocPage[] = [
  ...gettingStartedPages,
  ...openSourcePages,
  ...runningTestsPages,
  ...cliApiPages,
  ...cicdPages,
  ...troubleshootingPages,
  ...referencePages,
];

export function getDocPage(slug: string): DocPage | undefined {
  return docPages.find((p) => p.slug === slug);
}

export function docsByGroup(): { group: DocGroup; pages: DocPage[] }[] {
  return groupOrder
    .map((group) => ({ group, pages: docPages.filter((p) => p.group === group) }))
    .filter((g) => g.pages.length > 0);
}

export function docNeighbours(slug: string): { prev?: DocPage; next?: DocPage } {
  const flat = docsByGroup().flatMap((g) => g.pages);
  const i = flat.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: flat[i - 1], next: flat[i + 1] };
}

export function relatedDocs(slug: string, count = 3): DocPage[] {
  const page = getDocPage(slug);
  if (!page) return [];
  return docPages
    .filter((p) => p.slug !== slug && p.group === page.group)
    .slice(0, count);
}
