import { AppContainer } from "@/components/layout/app-container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Link, Text } from "@heroui/react";
import { notFound } from "next/navigation";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const d = await getDictionary(locale);
  return (
    <AppContainer className="max-w-prose py-12">
      <h1 className="text-2xl font-semibold text-foreground">{d.nav.library}</h1>
      <Text className="mt-4 text-pretty leading-relaxed">
        {d.libraryPage.intro}
      </Text>
      <div className="mt-8">
        <Link
          href={`/${locale}/catalog`}
          className="text-sm font-medium text-foreground"
        >
          {d.libraryPage.openCatalog} →
        </Link>
      </div>
    </AppContainer>
  );
}
