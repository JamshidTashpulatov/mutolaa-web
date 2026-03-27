"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteSidebarShell } from "./site-sidebar-shell";

function isFullscreenBookReaderPath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  return /\/books\/[^/]+\/read\/?$/.test(pathname);
}

function isSidebarHomePath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  return /^\/[^/]+\/home-sidebar\/?$/.test(pathname);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isFullscreenBookReaderPath(pathname)) {
    return <>{children}</>;
  }
  if (isSidebarHomePath(pathname)) {
    return <SiteSidebarShell>{children}</SiteSidebarShell>;
  }

  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
        <SiteHeader />
      </Suspense>
      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col bg-background"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
