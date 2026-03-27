"use client";

import { usePathname } from "next/navigation";
import { Suspense, useMemo } from "react";
import {
  Dropdown,
  IconChevronDown,
  Link,
  Text,
  buttonVariants,
  cn,
  linkVariants,
} from "@heroui/react";
import { locales, type Locale } from "@/i18n/config";
import { useDictionary } from "@/i18n/dictionary-context";
import { MutolaaLogo } from "@/components/brand/mutolaa-logo";
import { NavbarSearch } from "@/components/layout/navbar-search";
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

function IconHome({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconLayers({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconFlask({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 2v7.527a2 2 0 0 1-.211.894L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.13A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  );
}

function IconPanelLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

export type HomeV2SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  className?: string;
};

export function HomeV2Sidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
  className,
}: HomeV2SidebarProps) {
  const { dictionary: d, locale } = useDictionary();
  const pathname = usePathname();
  const rest = pathWithoutLocale(pathname, locale);

  const fictionItem = useMemo(
    () => MEGA_NAV_ITEMS.find((i) => i.id === "badiiy-asar")!,
    [],
  );
  const scienceItem = useMemo(
    () => MEGA_NAV_ITEMS.find((i) => i.id === "ilmiy-ommabop")!,
    [],
  );

  const isHomeActive =
    pathname === `/${locale}/home-sidebar` ||
    pathname === `/${locale}/home-sidebar/`;

  const navBtn = (active: boolean) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "h-11 w-full gap-3 rounded-xl px-3 font-medium transition-colors",
      active
        ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/80"
        : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900",
      collapsed && "justify-center px-0",
    );

  const iconClass = "size-5 shrink-0 text-neutral-500";

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-5 py-6",
        collapsed ? "px-2" : "px-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          collapsed ? "flex-col" : "justify-between",
        )}
      >
        <Link
          href={`/${locale}/home-sidebar`}
          className={cn(
            "inline-flex min-w-0 items-center outline-offset-2 focus-visible:rounded-lg",
            collapsed && "justify-center",
          )}
          aria-label={d.brand}
          onClick={onNavigate}
        >
          {collapsed ? (
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#FF6900]/12 text-lg font-bold text-[#FF6900]">
              M
            </span>
          ) : (
            <MutolaaLogo className="h-7 sm:h-8" />
          )}
        </Link>
        {onNavigate === undefined ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "size-9 shrink-0 rounded-lg border border-neutral-200/80 bg-white p-0 text-neutral-600 shadow-sm hover:bg-neutral-50",
              collapsed && "mt-1",
            )}
            aria-label={collapsed ? d.homeV2.expand : d.homeV2.collapse}
            aria-pressed={collapsed}
          >
            <IconPanelLeft
              className={cn(
                "size-4 transition-transform",
                collapsed && "opacity-80",
              )}
            />
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <Suspense
          fallback={
            <div
              className="h-11 w-full animate-pulse rounded-xl bg-white/50"
              aria-hidden
            />
          }
        >
          <NavbarSearch
            locale={locale}
            placeholder={d.homeV2.searchPlaceholder}
            className="max-w-none [&_form]:max-w-none"
          />
        </Suspense>
      ) : null}

      <nav
        aria-label="Primary"
        className="flex min-h-0 flex-1 flex-col gap-0.5"
      >
        <Link
          href={`/${locale}/home-sidebar`}
          className={navBtn(isHomeActive)}
          aria-label={collapsed ? d.homeV2.sidebar.home : undefined}
          onClick={onNavigate}
        >
          <IconHome className={iconClass} />
          {!collapsed ? d.homeV2.sidebar.home : null}
        </Link>
        <Link
          href={`/${locale}/collections`}
          className={navBtn(pathname.includes("/collections"))}
          aria-label={collapsed ? d.homeV2.sidebar.collections : undefined}
          onClick={onNavigate}
        >
          <IconLayers className={iconClass} />
          {!collapsed ? d.homeV2.sidebar.collections : null}
        </Link>
        <Link
          href={`/${locale}/catalog`}
          className={navBtn(pathname.includes("/catalog"))}
          aria-label={collapsed ? d.homeV2.sidebar.audiobooks : undefined}
          onClick={onNavigate}
        >
          <IconHeadphones className={iconClass} />
          {!collapsed ? d.homeV2.sidebar.audiobooks : null}
        </Link>
        <Link
          href={megaNavCategoryHref(locale, fictionItem)}
          className={navBtn(false)}
          aria-label={collapsed ? d.homeV2.sidebar.fiction : undefined}
          onClick={onNavigate}
        >
          <IconBook className={iconClass} />
          {!collapsed ? d.homeV2.sidebar.fiction : null}
        </Link>
        <Link
          href={megaNavCategoryHref(locale, scienceItem)}
          className={navBtn(false)}
          aria-label={collapsed ? d.homeV2.sidebar.science : undefined}
          onClick={onNavigate}
        >
          <IconFlask className={iconClass} />
          {!collapsed ? d.homeV2.sidebar.science : null}
        </Link>
      </nav>

      <div
        className={cn(
          "mt-auto flex flex-col gap-4 border-t border-neutral-200/80 pt-5",
        )}
      >
        <Link
          href={`/${locale}/about`}
          className={cn(
            linkVariants(),
            "text-sm text-neutral-600 hover:text-neutral-900",
            collapsed && "flex justify-center",
          )}
          aria-label={collapsed ? d.homeV2.sidebar.about : undefined}
          onClick={onNavigate}
        >
          {collapsed ? (
            <span className="text-xs font-medium text-neutral-500">i</span>
          ) : (
            d.homeV2.sidebar.about
          )}
        </Link>
        <Link
          href={`/${locale}/help`}
          className={cn(
            linkVariants(),
            "text-sm text-neutral-600 hover:text-neutral-900",
            collapsed && "flex justify-center",
          )}
          aria-label={collapsed ? d.homeV2.sidebar.help : undefined}
          onClick={onNavigate}
        >
          {collapsed ? (
            <span className="text-xs font-medium text-neutral-500">?</span>
          ) : (
            d.homeV2.sidebar.help
          )}
        </Link>

        {!collapsed ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-700">
            <span className="shrink-0 text-neutral-500">
              {d.homeV2.sidebar.languagePrefix}
            </span>
            <Dropdown>
              <Dropdown.Trigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 min-w-0 gap-1 px-2 font-medium text-neutral-800 hover:bg-white/80",
                )}
              >
                <span className="truncate">{d.locale[locale]}</span>
                <IconChevronDown className="size-4 shrink-0 opacity-60" />
              </Dropdown.Trigger>
              <Dropdown.Popover placement="top start" className="min-w-[10rem]">
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
          </div>
        ) : (
          <div className="flex justify-center">
            <Dropdown>
              <Dropdown.Trigger
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "size-9 p-0",
                )}
                aria-label={d.header.languageMenu}
              >
                <span className="text-base leading-none">
                  {LOCALE_FLAGS[locale]}
                </span>
              </Dropdown.Trigger>
              <Dropdown.Popover placement="top start" className="min-w-[10rem]">
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
          </div>
        )}

        <div className={cn("flex flex-col gap-2", collapsed && "items-center")}>
          <Link
            href={`/${locale}/premium`}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "h-11 w-full justify-center rounded-xl bg-[#FF6900] font-semibold text-white shadow-sm hover:opacity-[0.96]",
              collapsed && "size-11 min-w-0 px-0",
            )}
            aria-label={collapsed ? d.homeV2.auth.login : undefined}
            onClick={onNavigate}
          >
            {collapsed ? (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ) : (
              d.homeV2.auth.login
            )}
          </Link>
          {!collapsed ? (
            <Link
              href={`/${locale}/premium`}
              className={cn(
                linkVariants(),
                "text-center text-sm font-medium text-neutral-600 hover:text-neutral-900",
              )}
              onClick={onNavigate}
            >
              {d.homeV2.auth.register}
            </Link>
          ) : null}
        </div>

        {!collapsed ? (
          <Text size="sm" variant="muted" className="text-center text-xs">
            © {new Date().getFullYear()} {d.brand}
          </Text>
        ) : null}
      </div>
    </div>
  );
}
