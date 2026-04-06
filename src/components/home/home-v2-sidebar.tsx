"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
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

/** Audiokitoblar menyusi — katalogda `section=audio` (filtr emas, faol holat uchun). */
export const HOME_V2_CATALOG_AUDIO_SECTION = "audio";

function catalogAudioHref(locale: string) {
  return `/${locale}/catalog?section=${HOME_V2_CATALOG_AUDIO_SECTION}`;
}

function catalogFictionHref(locale: string) {
  return `/${locale}/catalog?genre=novel`;
}

function catalogScienceHref(locale: string) {
  return `/${locale}/catalog?genre=essays`;
}

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

function IconInfo({ className }: { className?: string }) {
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
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function IconHelpCircle({ className }: { className?: string }) {
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
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  className?: string;
};

function SidebarNavLink({
  href,
  active,
  collapsed,
  icon,
  children,
  onNavigate,
  ariaLabel,
}: {
  href: string;
  active: boolean;
  collapsed?: boolean;
  icon: ReactNode;
  children: ReactNode;
  onNavigate?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={onNavigate}
      className={cn(
        "flex h-11 w-full min-w-0 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
        "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6900]",
        active
          ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/90"
          : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900",
        collapsed && "justify-center px-0",
      )}
    >
      <span className={cn("shrink-0 text-neutral-500", collapsed && "mx-auto")}>
        {icon}
      </span>
      {!collapsed ? (
        <span className="min-w-0 flex-1 truncate text-left leading-snug">
          {children}
        </span>
      ) : null}
    </Link>
  );
}

function HomeV2SidebarInner({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  className,
}: HomeV2SidebarProps) {
  const { dictionary: d, locale } = useDictionary();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rest = pathWithoutLocale(pathname, locale);

  const genre = searchParams.get("genre");
  const section = searchParams.get("section");
  const onCatalog = pathname.includes("/catalog");

  const isHomeActive =
    pathname === `/${locale}/home-sidebar` ||
    pathname === `/${locale}/home-sidebar/`;

  const isCollectionsActive = pathname.includes("/collections");

  const isAudioActive =
    onCatalog &&
    section === HOME_V2_CATALOG_AUDIO_SECTION &&
    !genre;

  const isFictionActive = onCatalog && genre === "novel";

  const isScienceActive = onCatalog && genre === "essays";

  const iconClass = "size-5";

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 py-5",
        collapsed ? "px-2.5" : "px-3.5",
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
            "inline-flex min-w-0 items-center rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6900]",
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
            <MutolaaLogo className="h-7 w-auto max-w-[9.5rem]" />
          )}
        </Link>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "size-9 shrink-0 rounded-lg border border-neutral-200/90 bg-white p-0 text-neutral-600 shadow-sm hover:bg-neutral-50",
              collapsed && "mt-1",
            )}
            aria-label={collapsed ? d.homeV2.expand : d.homeV2.collapse}
            aria-pressed={collapsed}
          >
            <IconPanelLeft
              className={cn(
                "size-4 transition-transform duration-200",
                collapsed && "scale-x-[-1]",
              )}
            />
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <NavbarSearch
          locale={locale}
          placeholder={d.homeV2.searchPlaceholder}
          className="max-w-none [&_form]:max-w-none"
        />
      ) : null}

      <nav
        aria-label="Primary"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto"
      >
        <SidebarNavLink
          href={`/${locale}/home-sidebar`}
          active={isHomeActive}
          collapsed={collapsed}
          onNavigate={onNavigate}
          ariaLabel={collapsed ? d.homeV2.sidebar.home : undefined}
          icon={<IconHome className={iconClass} />}
        >
          {d.homeV2.sidebar.home}
        </SidebarNavLink>
        <SidebarNavLink
          href={`/${locale}/collections`}
          active={isCollectionsActive}
          collapsed={collapsed}
          onNavigate={onNavigate}
          ariaLabel={collapsed ? d.homeV2.sidebar.collections : undefined}
          icon={<IconLayers className={iconClass} />}
        >
          {d.homeV2.sidebar.collections}
        </SidebarNavLink>
        <SidebarNavLink
          href={catalogAudioHref(locale)}
          active={isAudioActive}
          collapsed={collapsed}
          onNavigate={onNavigate}
          ariaLabel={collapsed ? d.homeV2.sidebar.audiobooks : undefined}
          icon={<IconHeadphones className={iconClass} />}
        >
          {d.homeV2.sidebar.audiobooks}
        </SidebarNavLink>
        <SidebarNavLink
          href={catalogFictionHref(locale)}
          active={isFictionActive}
          collapsed={collapsed}
          onNavigate={onNavigate}
          ariaLabel={collapsed ? d.homeV2.sidebar.fiction : undefined}
          icon={<IconBook className={iconClass} />}
        >
          {d.homeV2.sidebar.fiction}
        </SidebarNavLink>
        <SidebarNavLink
          href={catalogScienceHref(locale)}
          active={isScienceActive}
          collapsed={collapsed}
          onNavigate={onNavigate}
          ariaLabel={collapsed ? d.homeV2.sidebar.science : undefined}
          icon={<IconFlask className={iconClass} />}
        >
          {d.homeV2.sidebar.science}
        </SidebarNavLink>
      </nav>

      <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-neutral-200/90 pt-4">
        <Link
          href={`/${locale}/about`}
          onClick={onNavigate}
          aria-label={collapsed ? d.homeV2.sidebar.about : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors",
            "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6900]",
            pathname.includes("/about")
              ? "bg-white font-medium text-neutral-900 ring-1 ring-neutral-200/90"
              : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900",
            collapsed && "justify-center px-0",
          )}
        >
          <IconInfo className="size-[18px] shrink-0 text-neutral-500" />
          {!collapsed ? d.homeV2.sidebar.about : null}
        </Link>
        <Link
          href={`/${locale}/help`}
          onClick={onNavigate}
          aria-label={collapsed ? d.homeV2.sidebar.help : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors",
            "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6900]",
            pathname.includes("/help")
              ? "bg-white font-medium text-neutral-900 ring-1 ring-neutral-200/90"
              : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900",
            collapsed && "justify-center px-0",
          )}
        >
          <IconHelpCircle className="size-[18px] shrink-0 text-neutral-500" />
          {!collapsed ? d.homeV2.sidebar.help : null}
        </Link>

        {!collapsed ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="shrink-0 text-neutral-500">
              {d.homeV2.sidebar.languagePrefix}
            </span>
            <Dropdown>
              <Dropdown.Trigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 min-w-0 max-w-full gap-1 px-2 font-medium text-neutral-800 hover:bg-white/90",
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
                  "size-9 border border-neutral-200/90 bg-white p-0 shadow-sm",
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

        <div className={cn("flex flex-col gap-2 pt-1", collapsed && "items-center")}>
          <Link
            href={`/${locale}/premium`}
            className={cn(
              "flex h-11 w-full items-center justify-center rounded-xl bg-[#FF6900] text-sm font-semibold text-white shadow-sm",
              "transition-opacity hover:opacity-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6900]",
              collapsed && "size-11 min-w-0 max-w-none px-0",
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
                "py-1 text-center text-sm font-medium text-neutral-600 hover:text-neutral-900",
              )}
              onClick={onNavigate}
            >
              {d.homeV2.auth.register}
            </Link>
          ) : null}
        </div>

        {!collapsed ? (
          <Text
            size="sm"
            variant="muted"
            className="text-center text-[11px] leading-relaxed"
          >
            © {new Date().getFullYear()} {d.brand}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

function SidebarSuspenseFallback({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col gap-4 py-5",
        collapsed ? "px-2.5" : "px-3.5",
      )}
    >
      <div className="h-9 animate-pulse rounded-xl bg-white/50" />
      <div className="h-11 animate-pulse rounded-xl bg-white/50" />
      <div className="flex flex-1 flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-xl bg-white/40"
          />
        ))}
      </div>
    </div>
  );
}

export function HomeV2Sidebar(props: HomeV2SidebarProps) {
  return (
    <Suspense fallback={<SidebarSuspenseFallback collapsed={props.collapsed} />}>
      <HomeV2SidebarInner {...props} />
    </Suspense>
  );
}
