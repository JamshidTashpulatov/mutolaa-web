"use client";

import { usePathname } from "next/navigation";
import {
  Avatar,
  Dropdown,
  IconChevronDown,
  Link,
  Popover,
  Text,
  buttonVariants,
  cn,
  linkVariants,
} from "@heroui/react";
import { locales, type Locale } from "@/i18n/config";
import { useDictionary } from "@/i18n/dictionary-context";
import {
  MEGA_NAV_ITEMS,
  megaNavCategoryHref,
} from "@/lib/nav-mega-categories";
import { MutolaaLogo } from "@/components/brand/mutolaa-logo";
import {
  IconMenuCollections,
  IconMenuHistory,
  IconMenuLogout,
  IconMenuSettings,
} from "@/components/layout/header-menu-icons";
import { NavbarSearch } from "@/components/layout/navbar-search";
import { ProfileDarkModeMenuItem } from "@/components/layout/profile-dark-mode-menu-item";

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

export function SiteHeader() {
  const { dictionary: d, locale } = useDictionary();
  const pathname = usePathname();
  const rest = pathWithoutLocale(pathname, locale);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0 md:h-16">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={`/${locale}`}
            className="shrink-0 inline-flex items-center outline-offset-2 focus-visible:rounded-md"
            aria-label={d.brand}
          >
            <MutolaaLogo />
          </Link>
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:gap-x-2"
          >
            <Link
              href={`/${locale}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted hover:text-foreground",
              )}
            >
              {d.nav.home}
            </Link>

            <Popover>
              <Popover.Trigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1 font-medium text-muted hover:text-foreground",
                )}
              >
                {d.nav.genres}
                <IconChevronDown className="size-4 opacity-60" aria-hidden />
              </Popover.Trigger>
              <Popover.Content
                placement="bottom start"
                className="max-w-[calc(100vw-1rem)] sm:max-w-none"
              >
                <Popover.Dialog>
                  <Popover.Heading className="sr-only">
                    {d.nav.genres}
                  </Popover.Heading>
                  <div className="w-[min(100vw-1rem,40rem)] p-3 sm:p-4">
                    <Text
                      size="sm"
                      variant="muted"
                      className="mb-3 font-medium uppercase tracking-wide"
                    >
                      {d.nav.megaMenuHeading}
                    </Text>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                      {MEGA_NAV_ITEMS.map((item) => {
                        const label = d.nav.megaCategories[item.id];
                        return (
                          <Link
                            key={item.id}
                            href={megaNavCategoryHref(locale, item)}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                          >
                            <span
                              className="flex size-8 shrink-0 items-center justify-center text-base leading-none"
                              aria-hidden
                            >
                              {item.emoji}
                            </span>
                            <span className="min-w-0 flex-1 font-medium leading-snug">
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
                    </div>
                    <div className="mt-4 border-t border-border pt-3">
                      <Link
                        href={`/${locale}/catalog`}
                        className={cn(
                          linkVariants(),
                          "px-2 py-2 text-sm font-medium",
                        )}
                      >
                        {d.nav.allCatalog}
                      </Link>
                    </div>
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>

            <Link
              href={`/${locale}/library`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted hover:text-foreground",
              )}
            >
              {d.nav.shelf}
            </Link>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:shrink-0">
          <div className="hidden min-w-0 sm:block">
            <NavbarSearch
              locale={locale}
              placeholder={d.header.searchPlaceholder}
            />
          </div>

          <Link
            href={`/${locale}/premium`}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "shrink-0 shadow-sm",
            )}
          >
            {d.header.premium}
          </Link>

          <Dropdown>
            <Dropdown.Trigger
              className={cn(
                buttonVariants({ variant: "secondary", size: "md" }),
                "min-w-[6.5rem] justify-between gap-2 sm:min-w-[7.5rem]",
              )}
            >
              <span className="truncate">{d.locale[locale]}</span>
              <IconChevronDown className="size-4 shrink-0 opacity-70" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end" className="min-w-[10rem]">
              <Dropdown.Menu aria-label={d.header.languageMenu}>
                {locales.map((code) => (
                  <Dropdown.Item
                    key={code}
                    href={`/${code}${rest}`}
                    textValue={d.locale[code]}
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
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuSettings />
                    {d.header.profileSettings}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  href={`/${locale}/library`}
                  textValue={d.header.profileHistory}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuHistory />
                    {d.header.profileHistory}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  href={`/${locale}/collections`}
                  textValue={d.header.profileCollections}
                >
                  <span className="flex items-center gap-2.5">
                    <IconMenuCollections />
                    {d.header.profileCollections}
                  </span>
                </Dropdown.Item>
                <ProfileDarkModeMenuItem label={d.header.profileDarkMode} />
                <Dropdown.Item href={`/${locale}`} textValue={d.header.profileLogout}>
                  <span className="flex items-center gap-2.5">
                    <IconMenuLogout />
                    {d.header.profileLogout}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        <div className="w-full border-t border-border pt-3 sm:hidden">
          <NavbarSearch
            locale={locale}
            placeholder={d.header.searchPlaceholder}
          />
        </div>
      </div>
    </header>
  );
}
