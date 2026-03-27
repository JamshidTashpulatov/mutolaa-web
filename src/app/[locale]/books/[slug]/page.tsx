import { BookDetailView } from "@/components/content/book-detail-view";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalizedReviews } from "@/lib/catalog";
import { getCatalogBooks } from "@/lib/books-data";
import { getBookDetailLocalized } from "@/lib/books-detail-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const books = await getCatalogBooks();
  return books.map((b) => ({ slug: b.slug }));
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
  if (!book) {
    return {};
  }
  const description =
    book.synopsis.length > 160
      ? `${book.synopsis.slice(0, 157)}…`
      : book.synopsis;
  return {
    title: book.title,
    description: description || undefined,
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  const book = await getBookDetailLocalized(slug, locale);
  if (!book) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const genreLabel =
    dictionary.catalog.genres[
      book.genre as keyof typeof dictionary.catalog.genres
    ];
  const reviews = getLocalizedReviews(slug, locale);

  return (
    <BookDetailView
      book={book}
      genreLabel={genreLabel}
      reviews={reviews}
      dictionary={dictionary}
      locale={locale}
    />
  );
}
