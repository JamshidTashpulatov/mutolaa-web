import { AppContainer } from "@/components/layout/app-container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Text } from "@heroui/react";
import { notFound } from "next/navigation";

export default async function AboutPage({
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
    <AppContainer className="py-12">
      <Text size="sm" variant="muted">
        {d.footer.about}
      </Text>
    </AppContainer>
  );
}
