import type { Genre } from "@/lib/catalog";

/**
 * Mutolaa navbar mega-menu categories (Janrlar).
 * Order matches product reference; counts are display hints until API wiring.
 */
export const MEGA_NAV_CATEGORY_ORDER = [
  "tarixiy",
  "hajviy",
  "sarguzasht",
  "badiiy-asar",
  "doston",
  "bolalar-adabiyoti",
  "dramaturgiya",
  "hikoya",
  "uygonish",
  "diniy-marifiy",
  "ilmiy-ommabop",
  "folklor",
  "sher",
  "roman",
  "ertaklar",
  "avtobiografik",
  "jadidlar",
  "qissa",
  "konstitutsiya",
] as const;

export type MegaNavCategoryId = (typeof MEGA_NAV_CATEGORY_ORDER)[number];

export type MegaNavCategoryItem = {
  id: MegaNavCategoryId;
  emoji: string;
  /** Optional shelf count for display */
  count?: number;
  /** When set, links to catalog with this genre filter */
  genre?: Genre;
};

export const MEGA_NAV_ITEMS: MegaNavCategoryItem[] = [
  { id: "tarixiy", emoji: "\u231B", count: 12 },
  { id: "hajviy", emoji: "\u{1F600}", count: 7 },
  { id: "sarguzasht", emoji: "\u{1F3D6}\uFE0F" },
  { id: "badiiy-asar", emoji: "\u{1F4DA}" },
  { id: "doston", emoji: "\u2728", genre: "folklore" },
  { id: "bolalar-adabiyoti", emoji: "\u{1F476}", genre: "essays" },
  { id: "dramaturgiya", emoji: "\u{1F61C}", genre: "drama" },
  { id: "hikoya", emoji: "\u{1F4C4}", genre: "essays" },
  { id: "uygonish", emoji: "\u{1F525}" },
  { id: "diniy-marifiy", emoji: "\u{1F319}", count: 3 },
  { id: "ilmiy-ommabop", emoji: "\u{1F60E}", count: 74 },
  { id: "folklor", emoji: "\u{1F511}", genre: "folklore" },
  { id: "sher", emoji: "\u2712\uFE0F", genre: "poetry" },
  { id: "roman", emoji: "\u2B50", genre: "novel" },
  { id: "ertaklar", emoji: "\u{1F603}", genre: "folklore" },
  { id: "avtobiografik", emoji: "\u{1F464}", genre: "essays" },
  { id: "jadidlar", emoji: "\u{1F451}" },
  { id: "qissa", emoji: "\u{1F4A1}", genre: "essays" },
  { id: "konstitutsiya", emoji: "\u{1F4D6}" },
];

export function megaNavCategoryHref(locale: string, item: MegaNavCategoryItem): string {
  if (item.genre) {
    return `/${locale}/catalog?genre=${item.genre}`;
  }
  return `/${locale}/catalog`;
}

/** Home “Kategoriyalar” rail — same order and metadata as the Janrlar mega menu. */
export function buildHomeCategoryChips(
  locale: string,
  labels: Record<MegaNavCategoryId, string>,
): {
  id: MegaNavCategoryId;
  emoji: string;
  label: string;
  href: string;
}[] {
  return MEGA_NAV_ITEMS.map((item) => ({
    id: item.id,
    emoji: item.emoji,
    label: labels[item.id],
    href: megaNavCategoryHref(locale, item),
  }));
}
