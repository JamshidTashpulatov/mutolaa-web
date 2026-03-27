import { unstable_cache } from "next/cache";
import {
  BOOKS,
  catalogPlaceholderCoverUrl,
  type CatalogBook,
} from "@/lib/catalog";
import { fetchMutolaaWebBooks } from "@/lib/mutolaa-api";

function withCoverFallback(books: CatalogBook[]): CatalogBook[] {
  const staticBySlug = new Map(BOOKS.map((b) => [b.slug, b]));
  return books.map((b) => {
    const hasCover = Boolean(b.coverUrl?.trim());
    if (hasCover) {
      return b;
    }
    const fromStatic = staticBySlug.get(b.slug);
    return {
      ...b,
      coverUrl:
        fromStatic?.coverUrl?.trim() ??
        catalogPlaceholderCoverUrl(b.slug),
    };
  });
}

async function loadCatalogBooks(): Promise<CatalogBook[]> {
  try {
    const fromApi = await fetchMutolaaWebBooks();
    if (fromApi.length > 0) {
      return withCoverFallback(fromApi);
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mutolaa] Could not load books from API, using static catalog:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return BOOKS;
}

/**
 * Server-side catalog list (API first, static fallback).
 * Cached ~5 minutes across requests.
 */
export function getCatalogBooks(): Promise<CatalogBook[]> {
  return unstable_cache(loadCatalogBooks, ["mutolaa-catalog-books"], {
    revalidate: 300,
    tags: ["mutolaa-books"],
  })();
}
