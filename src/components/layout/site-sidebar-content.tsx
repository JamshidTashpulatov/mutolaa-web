"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  Avatar,
  Dropdown,
  IconChevronDown,
  Link,
  Separator,
  Text,
  buttonVariants,
  cn,
  linkVariants,
} from "@heroui/react";
import { locales, type Locale } from "@/i18n/config";
import { useDictionary } from "@/i18n/dictionary-context";
import { MutolaaLogo } from "@/components/brand/mutolaa-logo";
import {
  IconMenuCollections,
  IconMenuHistory,
  IconMenuLogout,
  IconMenuSettings,
} from "@/components/layout/header-menu-icons";
import { NavbarSearch } from "@/components/layout/navbar-search";
import { ProfileDarkModeMenuItem } from "@/components/layout/profile-dark-mode-menu-item";
import {
  MEGA_NAV_ITEMS,
  megaNavCategoryHref,
} from "@/lib/nav-mega-categories";

function pathWithoutLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === locale) {
    parts.shift();
  }
  return parts.length ? `/${parts.join("/")}` : "";
}

const LOCALE_FLAGS: Record<Locale, string> = {
  uz: "\u{1F1FA}\u{1F1FF}",
  ru: "\u{1F1F7}\u{1F1FA}",
  en: "\u{1F1EC}\u{1F1E7}",
};

export type SiteSidebarContentProps = {
  /** Mobil menyu yopilishi uchun (link bosilganda) */
  onNavigate?: () => void;
  className?: string;
};

export function SiteSidebarContent({
  onNavigate,
  className,
}: SiteSidebarContentProps) {
  const { dictionary: d, locale } = useDictionary();
  const pathname = usePathname();
  const rest = pathWithoutLocale(pathname, locale);
  const year = new Date().getFullYear();

  const wrapNavigate =
    onNavigate !== undefined
      ? () => ({
          onClick: () => {
            onNavigate();
          },
        })
      : () => ({});

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-6 px-4 py-6 sm:px-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex shrink-0 items-center outline-offset-2 focus-visible:rounded-md"
          aria-label={d.brand}
          {...wrapNavigate()}
        >
          <MutolaaLogo />
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          <Dropdown>
            <Dropdown.Trigger
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "min-w-0 justify-between gap-1.5 px-2.5",
              )}
            >
              <span className="truncate text-xs sm:text-sm">
                {d.locale[locale]}
              </span>
              <IconChevronDown className="size-3.5 shrink-0 opacity-70" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end" className="min-w-[10rem]">
              <Dropdown.Menu aria-label={d.header.languageMenu}>
                {locales.map((code) => (
                  <Dropdown.Item
                    key={code}
                    href={`/${code}${rest}`}
                    textValue={d.locale[code]}
                    onClick={() => onNavigate?.()}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="text-base leading-none">
                        {LOCALE_FLAGS[code]}
                      </span>
                      {d.locale[code]}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger
              aria-label={d.header.profileLabel}
              className={cn(
                "shrink-0 rounded-full p-0 outline-none",
                "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <Avatar size="sm" className="size-9">
                <Avatar.Image
                  src="/avatar-gradient.png"
                  alt=""
                  className="object-cover"
                />
                <Avatar.Fallback className="text-xs font-medium">M</Avatar.Fallback>
              </Avatar>
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end" className="min-w-[12rem]">
              <Dropdown.Menu aria-label={d.header.profileLabel}>
                <Dropdown.Item
                  href={`/${locale}/about`}
                  textValue={d.header.profileSettings}
                  onClick={() => onNavigate?.()}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuSettings />
                    {d.header.profileSettings}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  href={`/${locale}/library`}
                  textValue={d.header.profileHistory}
                  onClick={() => onNavigate?.()}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuHistory />
                    {d.header.profileHistory}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  href={`/${locale}/collections`}
                  textValue={d.header.profileCollections}
                  onClick={() => onNavigate?.()}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuCollections />
                    {d.header.profileCollections}
                  </span>
                </Dropdown.Item>
                <ProfileDarkModeMenuItem label={d.header.profileDarkMode} />
                <Dropdown.Item
                  href={`/${locale}`}
                  textValue={d.header.profileLogout}
                  onClick={() => onNavigate?.()}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuLogout />
                    {d.header.profileLogout}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      <Suspense
        fallback={
          <div
            className="h-10 w-full animate-pulse rounded-lg bg-surface-secondary/80"
            aria-hidden
          />
        }
      >
        <NavbarSearch
          locale={locale}
          placeholder={d.header.searchPlaceholder}
          className="max-w-none"
        />
      </Suspense>

      <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col gap-1">
        <Link
          href={`/${locale}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start text-muted hover:text-foreground",
          )}
          {...wrapNavigate()}
        >
          {d.nav.home}
        </Link>
        <Link
          href={`/${locale}/home-sidebar`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start font-medium text-foreground",
          )}
          {...wrapNavigate()}
        >
          {d.nav.sidebarHome}
        </Link>
        <Link
          href={`/${locale}/catalog`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start text-muted hover:text-foreground",
          )}
          {...wrapNavigate()}
        >
          {d.nav.catalog}
        </Link>
        <Link
          href={`/${locale}/library`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start text-muted hover:text-foreground",
          )}
          {...wrapNavigate()}
        >
          {d.nav.shelf}
        </Link>

        <details className="group mt-1 rounded-lg border border-border bg-surface-secondary/40">
          <summary
            className={cn(
              "cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-foreground",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              {d.nav.genres}
              <IconChevronDown
                className="size-4 shrink-0 opacity-60 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </span>
          </summary>
          <div className="max-h-52 overflow-y-auto border-t border-border px-2 py-2">
            {MEGA_NAV_ITEMS.map((item) => {
              const label = d.nav.megaCategories[item.id];
              return (
                <Link
                  key={item.id}
                  href={megaNavCategoryHref(locale, item)}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                  onClick={() => onNavigate?.()}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="min-w-0 leading-snug">
                    {label}
                    {item.count !== undefined ? (
                      <span className="font-normal text-muted">
                        {" "}
                        ({item.count})
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
            <div className="mt-2 border-t border-border pt-2">
              <Link
                href={`/${locale}/catalog`}
                className={cn(linkVariants(), "block px-2 py-2 text-sm font-medium")}
                onClick={() => onNavigate?.()}
              >
                {d.nav.allCatalog}
              </Link>
            </div>
          </div>
        </details>

        <div className="mt-4">
          <Link
            href={`/${locale}/premium`}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "w-full justify-center shadow-sm",
            )}
            onClick={() => onNavigate?.()}
          >
            {d.header.premium}
          </Link>
        </div>
      </nav>

      <div className="mt-auto space-y-4 border-t border-border pt-6">
        <Text className="font-medium text-foreground">{d.brand}</Text>
        <Text size="sm" variant="muted" className="text-pretty">
          {d.footer.getApp}
        </Text>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
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
        <nav
          aria-label="Footer"
          className="flex flex-col gap-2 text-sm sm:gap-1.5"
        >
          <Link
            href={`/${locale}/about`}
            className="text-muted transition-colors hover:text-foreground"
            onClick={() => onNavigate?.()}
          >
            {d.footer.about}
          </Link>
          <Link
            href={`/${locale}/help`}
            className="text-muted transition-colors hover:text-foreground"
            onClick={() => onNavigate?.()}
          >
            {d.footer.help}
          </Link>
          <Link
            href={`/${locale}/collections`}
            className="text-muted transition-colors hover:text-foreground"
            onClick={() => onNavigate?.()}
          >
            {d.footer.collections}
          </Link>
          <Link
            href={`/${locale}/help`}
            className="text-muted transition-colors hover:text-foreground"
            onClick={() => onNavigate?.()}
          >
            {d.footer.contact}
          </Link>
        </nav>
        <Separator orientation="horizontal" />
        <Text size="sm" variant="muted">
          © {year} {d.brand}. {d.footer.rights}
        </Text>
        <Text size="sm" variant="muted">
          {d.footer.follow}
        </Text>
      </div>
    </div>
  );
}
