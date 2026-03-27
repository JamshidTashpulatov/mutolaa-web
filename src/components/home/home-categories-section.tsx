"use client";

import { Link, cn } from "@heroui/react";
import type { MegaNavCategoryId } from "@/lib/nav-mega-categories";
import { HomeSection } from "./home-section";

export type HomeCategoryChip = {
  id: MegaNavCategoryId;
  emoji: string;
  label: string;
  href: string;
};

export type HomeCategoriesSectionProps = {
  title: string;
  titleId: string;
  categories: HomeCategoryChip[];
};

export function HomeCategoriesSection({
  title,
  titleId,
  categories,
}: HomeCategoriesSectionProps) {
  return (
    <HomeSection titleId={titleId} title={title} showTitle={false}>
      <div className="flex flex-wrap gap-2">
        {categories.map(({ id, emoji, label, href }) => (
          <Link
            key={id}
            href={href}
            className={cn(
              "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-sm font-medium outline-offset-2 transition-colors",
              "border border-border bg-segment text-foreground shadow-sm",
              "hover:bg-surface-secondary hover:opacity-[0.98]",
              "focus-visible:ring-2 focus-visible:ring-focus",
              "dark:border-transparent dark:bg-white dark:text-neutral-950 dark:shadow-md dark:hover:bg-neutral-100",
            )}
          >
            <span className="shrink-0 text-base leading-none" aria-hidden>
              {emoji}
            </span>
            <span className="min-w-0 truncate">{label}</span>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
