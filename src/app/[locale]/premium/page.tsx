import { AppContainer } from "@/components/layout/app-container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Text } from "@heroui/react";
import { notFound } from "next/navigation";

export default async function PremiumPage({
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
      <h1 className="text-2xl font-semibold text-foreground">
        {d.header.premium}
      </h1>
      <Text className="mt-4 text-pretty leading-relaxed" variant="muted">
        {d.premiumPage.intro}
      </Text>
    </AppContainer>
  );
}
