export interface DocBlock {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: { lang: string; label?: string; body: string };
  table?: { columns: string[]; rows: string[][] };
  note?: string;
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  group: DocGroup;
  keywords: string[];
  readMinutes: number;
  blocks: DocBlock[];
}

export type DocGroup =
  | "Getting started"
  | "Open source UE"
  | "Running tests"
  | "CLI"
  | "API"
  | "SDK"
  | "CI/CD"
  | "Troubleshooting"
  | "Reference";

export const groupOrder: DocGroup[] = [
  "Getting started",
  "Open source UE",
  "Running tests",
  "CLI",
  "API",
  "SDK",
  "CI/CD",
  "Troubleshooting",
  "Reference",
];
