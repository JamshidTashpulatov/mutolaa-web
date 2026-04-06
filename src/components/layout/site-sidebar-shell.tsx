"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Link, buttonVariants, cn } from "@heroui/react";
import { useDictionary } from "@/i18n/dictionary-context";
import { MutolaaLogo } from "@/components/brand/mutolaa-logo";
import { HomeV2Sidebar } from "@/components/home/home-v2-sidebar";

function IconMenuLines({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function SiteSidebarShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { dictionary: d, locale } = useDictionary();

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f0f0f1] md:flex-row">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200/90 bg-[#e8e8ea] px-4 py-3 md:hidden">
        <Link
          href={`/${locale}/home-sidebar`}
          className="inline-flex min-w-0 items-center outline-offset-2 focus-visible:rounded-md"
          aria-label={d.brand}
        >
          <MutolaaLogo className="h-7 w-auto max-w-[10rem]" />
        </Link>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "secondary", size: "md" }),
            "inline-flex size-10 shrink-0 items-center justify-center border-neutral-200/90 bg-white p-0 shadow-sm",
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar-panel"
          aria-label={d.shell.sidebarMenu}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <IconMenuLines className="size-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={d.shell.closeSidebarOverlay}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="mobile-sidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label={d.shell.sidebarMenu}
            className="relative z-10 flex h-full max-h-dvh w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden border-r border-neutral-200/90 bg-[#e8e8ea] shadow-xl"
          >
            <div className="flex shrink-0 items-center justify-end border-b border-neutral-200/80 px-2 py-2">
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "size-10 rounded-lg text-neutral-600 hover:bg-white/80",
                )}
                aria-label={d.shell.closeSidebarOverlay}
                onClick={() => setMobileOpen(false)}
              >
                <IconClose className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <HomeV2Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}

      <aside
        className={cn(
          "relative hidden shrink-0 border-r border-neutral-200/90 bg-[#e8e8ea] transition-[width] duration-200 ease-out md:flex",
          "md:sticky md:top-0 md:h-dvh md:max-h-dvh md:flex-col",
          collapsed ? "md:w-[76px]" : "md:w-[280px]",
        )}
        aria-label={d.shell.sidebarMenu}
      >
        <div className="flex max-h-dvh min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain">
          <HomeV2Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        </div>
      </aside>

      <main
        id="main-content"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[#f0f0f1]"
      >
        {children}
      </main>
    </div>
  );
}
