import { CatalogView } from "@/components/catalog/catalog-view";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCatalogBooks } from "@/lib/books-data";
import { localizeBook } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Text } from "@heroui/react";

export const revalidate = 300;

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const source = await getCatalogBooks();
  const books = source.map((b) => localizeBook(b, locale));

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <Text variant="muted" size="sm">
            …
          </Text>
        </div>
      }
    >
      <CatalogView books={books} dictionary={dictionary} locale={locale} />
    </Suspense>
  );
}
