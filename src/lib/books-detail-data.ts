import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import type { BookDetailExtended } from "@/lib/catalog";
import { localizeBookToDetailExtended } from "@/lib/catalog";
import { getCatalogBooks } from "@/lib/books-data";
import {
  fetchMutolaaBookDetail,
  normalizeBookDetailToLocalized,
} from "@/lib/mutolaa-api";

async function loadBookDetailExtended(
  slug: string,
  locale: Locale,
): Promise<BookDetailExtended | null> {
  try {
    const json = await fetchMutolaaBookDetail(slug);
    const book = normalizeBookDetailToLocalized(json, locale);
    if (book) {
      return book;
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mutolaa] Book detail API failed, trying catalog:",
        slug,
        err instanceof Error ? err.message : err,
      );
    }
  }

  const books = await getCatalogBooks();
  const b = books.find((x) => x.slug === slug);
  return b ? localizeBookToDetailExtended(b, locale) : null;
}

/**
 * Book detail for `[slug]` page — prefers `BookDetail` API, falls back to cached catalog.
 */
export function getBookDetailLocalized(
  slug: string,
  locale: Locale,
): Promise<BookDetailExtended | null> {
  return unstable_cache(
    () => loadBookDetailExtended(slug, locale),
    ["mutolaa-book-detail", slug, locale],
    { revalidate: 300, tags: ["mutolaa-books", `book-${slug}`] },
  )();
}
