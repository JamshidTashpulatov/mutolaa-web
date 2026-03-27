"use client";

import { Badge, Link, cn } from "@heroui/react";
import { useHomeShelfSlot } from "@/components/home/home-shelf-slot-context";
import { BookCover3D } from "./book-cover-3d";

export type BookCardProps = {
  title: string;
  author: string;
  href: string;
  coverAlt: string;
  linkClassName?: string;
  formatLabel?: string;
  coverUrl?: string | null;
  /** `rail` = home horizontal shelves (~5 visible); `comfortable` = emphasis */
  size?: "rail" | "compact" | "comfortable";
};

const widthBySize = {
  rail: "w-[144px] sm:w-[148px]",
  compact: "w-[168px] sm:w-[172px]",
  comfortable: "w-[184px] sm:w-[192px]",
} as const;

export function BookCard({
  title,
  author,
  href,
  coverAlt,
  linkClassName,
  formatLabel,
  coverUrl,
  size = "compact",
}: BookCardProps) {
  const shelfSlotPx = useHomeShelfSlot();
  const fluidShelf = shelfSlotPx != null && shelfSlotPx > 0;
  const coverWidthPx = fluidShelf
    ? Math.max(72, Math.round(shelfSlotPx * 0.88))
    : undefined;

  return (
    <Link
      href={href}
      className={cn(
        "group block max-w-full shrink-0 rounded-lg outline-offset-2",
        !fluidShelf && widthBySize[size],
        linkClassName,
      )}
      style={fluidShelf ? { width: shelfSlotPx } : undefined}
    >
      <div className="flex flex-col bg-transparent">
        <div className="flex justify-center overflow-visible px-1 py-1 sm:px-2 sm:py-2">
          <BookCover3D
            coverUrl={coverUrl}
            coverAlt={coverAlt}
            size={size}
            widthPxOverride={coverWidthPx}
            badge={
              formatLabel ? (
                <Badge size="sm" variant="soft" color="accent" className="shadow-sm">
                  {formatLabel}
                </Badge>
              ) : null
            }
          />
        </div>
        <div className="space-y-1 px-1 pb-1 pt-3 sm:px-2">
          <p
            className={cn(
              "line-clamp-2 text-pretty font-semibold leading-snug text-foreground",
              fluidShelf && (shelfSlotPx as number) < 130 ? "text-xs" : "text-sm",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "line-clamp-2 leading-snug text-muted",
              fluidShelf && (shelfSlotPx as number) < 130 ? "text-[11px]" : "text-xs",
            )}
          >
            {author}
          </p>
        </div>
      </div>
    </Link>
  );
}
