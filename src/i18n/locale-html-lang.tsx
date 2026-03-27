"use client";

import { useEffect } from "react";
import type { Locale } from "./config";

const htmlLang: Record<Locale, string> = {
  uz: "uz",
  ru: "ru",
  en: "en",
};

export function LocaleHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];
  }, [locale]);
  return null;
}
