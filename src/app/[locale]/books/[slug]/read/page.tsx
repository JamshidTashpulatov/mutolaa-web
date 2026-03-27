import { BookEpubFlipReader } from "@/components/content/book-epub-flip-reader";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBookDetailLocalized } from "@/lib/books-detail-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

/** Lokal demo EPUB (`/public/epub/...`). `NEXT_PUBLIC_READER_LOCAL_EPUB` bilan almashtirish mumkin. */
const DEFAULT_LOCAL_EPUB = "/epub/blyton-five-fall-into-adventure.epub";

function configuredLocalEpubUrl(): string {
  const raw = process.env.NEXT_PUBLIC_READER_LOCAL_EPUB?.trim();
  if (!raw) {
    return DEFAULT_LOCAL_EPUB;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
}

/**
 * Qaysi EPUB ochilishini tanlash:
 * - Production: API `ebook_fragment` / `epub_url` dagi `.epub` havolasi ustun (haqiqiy kitob fayli).
 * - Development: sukut bo‘yicha **lokal** demo EPUB (siz qo‘ygan Blyton), chunki API ko‘pincha boshqa kitobning `.epub`ini beradi.
 * - Devda API ni sinash: `NEXT_PUBLIC_READER_USE_API_EPUB=true`
 * - Har doim lokal: `NEXT_PUBLIC_READER_PREFER_LOCAL_EPUB=true` (prod ham)
 */
function resolveEpubUrl(book: { ebookFragmentUrl: string | null }): string {
  const local = configuredLocalEpubUrl();
  const preferLocal =
    process.env.NEXT_PUBLIC_READER_PREFER_LOCAL_EPUB === "true" ||
    process.env.NEXT_PUBLIC_READER_PREFER_LOCAL_EPUB === "1";
  const useApiInDev =
    process.env.NEXT_PUBLIC_READER_USE_API_EPUB === "true" ||
    process.env.NEXT_PUBLIC_READER_USE_API_EPUB === "1";
  const devPreferLocal =
    process.env.NODE_ENV === "development" && !useApiInDev;

  if (preferLocal || devPreferLocal) {
    return local;
  }

  const u = book.ebookFragmentUrl?.trim();
  if (u && /\.epub(\?|#|$)/i.test(u)) {
    return u;
  }
  return local;
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    return {};
  }
  const locale = localeParam as Locale;
  const book = await getBookDetailLocalized(slug, locale);
  if (!book || !book.hasEbook) {
    return {};
  }
  return {
    title: `${book.title} — Mutolaa`,
  };
}

export default async function BookReadPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  const book = await getBookDetailLocalized(slug, locale);
  if (!book || !book.hasEbook) {
    notFound();
  }

  const d = await getDictionary(locale);
  const backHref = `/${locale}/books/${slug}`;
  const epubUrl = resolveEpubUrl(book);

  return (
    <BookEpubFlipReader
      epubUrl={epubUrl}
      title={book.title}
      author={book.author}
      coverFallbackUrl={book.coverUrl}
      backHref={backHref}
      labels={{
        close: d.book.readerClose,
        prev: d.book.readerPrev,
        next: d.book.readerNext,
        loading: d.book.readerLoading,
        error: d.book.readerError,
        empty: d.book.readerEmpty,
      }}
    />
  );
}
