"use client";

import { Link, cn, textVariants } from "@heroui/react";
import { AppContainer } from "@/components/layout/app-container";

export type HomeSectionProps = {
  titleId: string;
  title: string;
  /** When false, the heading row is hidden; `title` is still used as `aria-label` on the section. */
  showTitle?: boolean;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
};

/**
 * Shared chrome for home rails: consistent vertical rhythm, heading style, and optional “see all”.
 */
export function HomeSection({
  titleId,
  title,
  showTitle = true,
  subtitle,
  seeAllHref,
  seeAllLabel,
  children,
}: HomeSectionProps) {
  const hasHeaderRow =
    showTitle || Boolean(subtitle) || Boolean(seeAllHref);

  return (
    <section
      className="w-full"
      aria-labelledby={showTitle ? titleId : undefined}
      aria-label={showTitle ? undefined : title}
    >
      <AppContainer className="py-6 md:py-7">
        {hasHeaderRow ? (
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              {showTitle ? (
                <h2
                  id={titleId}
                  className={cn(
                    textVariants({ size: "sm", variant: "muted" }),
                    "font-medium uppercase tracking-wide text-foreground",
                  )}
                >
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p
                  className={cn(
                    textVariants({ size: "sm" }),
                    showTitle && "mt-1.5",
                    "max-w-2xl text-pretty text-muted",
                  )}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>
            {seeAllHref ? (
              <Link
                href={seeAllHref}
                className={cn(
                  textVariants({ size: "sm" }),
                  "shrink-0 text-muted transition-colors hover:text-foreground",
                )}
              >
                {seeAllLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </AppContainer>
    </section>
  );
}
