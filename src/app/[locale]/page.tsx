import { HomePageView } from "@/components/home/home-page-view";
import { isLocale, type Locale } from "@/i18n/config";
import { getCatalogBooks } from "@/lib/books-data";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  const books = await getCatalogBooks();
  if (books.length === 0) {
    notFound();
  }

  return <HomePageView locale={locale} books={books} />;
}
