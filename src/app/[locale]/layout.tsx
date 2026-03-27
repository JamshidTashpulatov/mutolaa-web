import { AppShell } from "@/components/layout/app-shell";
import { isLocale } from "@/i18n/config";
import { DictionaryProvider } from "@/i18n/dictionary-context";
import { getDictionary } from "@/i18n/get-dictionary";
import { LocaleHtmlLang } from "@/i18n/locale-html-lang";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ locale: "uz" }, { locale: "ru" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dictionary = await getDictionary(locale);

  return (
    <DictionaryProvider dictionary={dictionary} locale={locale}>
      <LocaleHtmlLang locale={locale} />
      <AppShell>{children}</AppShell>
    </DictionaryProvider>
  );
}
