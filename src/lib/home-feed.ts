import type { CuratedCollectionId } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { localizeBook, type CatalogBook, type Genre } from "@/lib/catalog";

export type HomeListedBook = ReturnType<typeof localizeBook>;

const HOME_SECTION_BOOKS = 12;

function toHome(book: CatalogBook, locale: Locale): HomeListedBook {
  return localizeBook(book, locale);
}

/** Newest / “yangi” — year first, then slug so tie ≠ API order. */
function sortNewestFirst(a: CatalogBook, b: CatalogBook): number {
  if (b.year !== a.year) {
    return b.year - a.year;
  }
  return a.slug.localeCompare(b.slug);
}

function sortAlphabetical(
  a: CatalogBook,
  b: CatalogBook,
  locale: Locale,
): number {
  return a.title[locale].localeCompare(b.title[locale], locale);
}

function preferGenres(genres: Genre[]) {
  return (a: CatalogBook, b: CatalogBook): number => {
    const aw = genres.includes(a.genre) ? 0 : 1;
    const bw = genres.includes(b.genre) ? 0 : 1;
    if (aw !== bw) {
      return aw - bw;
    }
    return a.slug.localeCompare(b.slug);
  };
}

/**
 * Fill up to `count` books per section from ordered pools, avoiding repeats across
 * sections until the catalog is exhausted (then may reuse).
 */
function allocateSections(
  books: CatalogBook[],
  pools: CatalogBook[][],
  count: number,
): CatalogBook[][] {
  const used = new Set<string>();
  const sections: CatalogBook[][] = pools.map(() => []);

  const tryTake = (row: CatalogBook[], b: CatalogBook) => {
    if (row.length >= count) {
      return;
    }
    if (used.has(b.slug)) {
      return;
    }
    used.add(b.slug);
    row.push(b);
  };

  for (let i = 0; i < pools.length; i++) {
    const row = sections[i];
    for (const b of pools[i]) {
      tryTake(row, b);
    }
  }

  /* Top up any short row from global order (API list) without repeating if possible */
  for (let i = 0; i < sections.length; i++) {
    const row = sections[i];
    for (const b of books) {
      if (row.length >= count) {
        break;
      }
      tryTake(row, b);
    }
  }

  /* Still short (tiny catalog): allow repeats cycling API order */
  for (let i = 0; i < sections.length; i++) {
    const row = sections[i];
    let k = 0;
    while (row.length < count && books.length > 0) {
      row.push(books[k % books.length]);
      k += 1;
    }
  }

  return sections;
}

export function buildHomeFeed(books: CatalogBook[], locale: Locale) {
  if (books.length === 0) {
    return {
      mostRead: [] as HomeListedBook[],
      newlyAdded: [] as HomeListedBook[],
      recommendations: [] as HomeListedBook[],
      audiobooks: [] as HomeListedBook[],
      uzbekLiterature: [] as HomeListedBook[],
      worldLiterature: [] as HomeListedBook[],
    };
  }

  const apiOrder = books;
  const newest = [...books].sort(sortNewestFirst);
  const reversed = [...books].reverse();
  const alphabetical = [...books].sort((a, b) => sortAlphabetical(a, b, locale));
  const uzbekLean = [...books].sort(preferGenres(["novel", "essays", "folklore"]));
  const worldLean = [...books].sort(
    preferGenres(["poetry", "drama", "folklore"]),
  );

  const [
    mostReadRaw,
    newlyAddedRaw,
    recommendationsRaw,
    audiobooksRaw,
    uzbekRaw,
    worldRaw,
  ] = allocateSections(
    books,
    [apiOrder, newest, reversed, alphabetical, uzbekLean, worldLean],
    HOME_SECTION_BOOKS,
  );

  return {
    mostRead: mostReadRaw.map((b) => toHome(b, locale)),
    newlyAdded: newlyAddedRaw.map((b) => toHome(b, locale)),
    recommendations: recommendationsRaw.map((b) => toHome(b, locale)),
    audiobooks: audiobooksRaw.map((b) => toHome(b, locale)),
    uzbekLiterature: uzbekRaw.map((b) => toHome(b, locale)),
    worldLiterature: worldRaw.map((b) => toHome(b, locale)),
  };
}

export const CURATED_COLLECTION_ORDER: CuratedCollectionId[] = [
  "overnight",
  "goals",
  "romance",
  "children",
  "comics",
];

export function curatedCollectionHref(
  locale: Locale,
  id: CuratedCollectionId,
): string {
  return `/${locale}/collections#${id}`;
}
