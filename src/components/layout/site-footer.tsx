"use client";

import { Link, Separator, Text } from "@heroui/react";
import { useDictionary } from "@/i18n/dictionary-context";

export function SiteFooter() {
  const { dictionary: d, locale } = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-2">
            <Text className="font-medium text-foreground">{d.brand}</Text>
            <Text size="sm" variant="muted" className="text-pretty">
              {d.footer.getApp}
            </Text>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-sm text-muted">
              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {d.header.appStore}
              </Link>
              <span aria-hidden className="select-none">
                ·
              </span>
              <Link
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {d.header.googlePlay}
              </Link>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:flex sm:flex-wrap sm:justify-end"
          >
            <Link
              href={`/${locale}/about`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {d.footer.about}
            </Link>
            <Link
              href={`/${locale}/help`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {d.footer.help}
            </Link>
            <Link
              href={`/${locale}/collections`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {d.footer.collections}
            </Link>
            <Link
              href={`/${locale}/help`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {d.footer.contact}
            </Link>
          </nav>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text size="sm" variant="muted">
            © {year} {d.brand}. {d.footer.rights}
          </Text>
          <Text size="sm" variant="muted">
            {d.footer.follow}
          </Text>
        </div>
      </div>
    </footer>
  );
}
