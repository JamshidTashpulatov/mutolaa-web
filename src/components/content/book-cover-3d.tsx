"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@heroui/react";

/**
 * 3D book cover with hover tilt — adapted from Cuicui “Modern Book Cover”
 * @see https://cuicui.day/other/books
 * @see https://github.com/damien-schneider/cuicui/tree/main/packages/ui/cuicui/other/books/modern-book-cover
 */
const sizeStyles = {
  /** Home horizontal rails — ~5 cards visible in max-w-5xl */
  rail: { widthPx: 132, spineWidth: 34, zDepth: 17 },
  compact: { widthPx: 152, spineWidth: 40, zDepth: 20 },
  comfortable: { widthPx: 176, spineWidth: 46, zDepth: 22 },
} as const;

const glossStyle: CSSProperties = {
  minWidth: "8.2%",
  background:
    "linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)",
  opacity: 0.25,
};

export type BookCover3DProps = {
  coverUrl?: string | null;
  coverAlt: string;
  size?: keyof typeof sizeStyles;
  /** When set, front cover width in px (3D spine/depth scale from rail ratios). */
  widthPxOverride?: number;
  className?: string;
  badge?: ReactNode;
};

export function BookCover3D({
  coverUrl,
  coverAlt,
  size = "compact",
  widthPxOverride,
  className,
  badge,
}: BookCover3DProps) {
  const preset = sizeStyles[size];
  const widthPx = widthPxOverride ?? preset.widthPx;
  const spineWidth = widthPxOverride
    ? Math.max(22, Math.round(preset.spineWidth * (widthPxOverride / preset.widthPx)))
    : preset.spineWidth;
  const zDepth = widthPxOverride
    ? Math.max(10, Math.round(preset.zDepth * (widthPxOverride / preset.widthPx)))
    : preset.zDepth;
  const spineTranslateX = widthPx - 28;

  return (
    <div
      className={cn(
        "z-10 w-min [perspective:800px]",
        "[--book-shadow-1:rgba(15,23,42,0.08)] [--book-shadow-2:rgba(15,23,42,0.14)]",
        "dark:[--book-shadow-1:rgba(0,0,0,0.35)] dark:[--book-shadow-2:rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div
        style={{
          width: widthPx,
          transition: "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={cn(
          "relative aspect-[3/4] rounded-lg [transform-style:preserve-3d]",
          "[transform:rotateY(0deg)] group-hover:[transform:rotateY(-28deg)]",
          "motion-reduce:transition-none motion-reduce:group-hover:[transform:rotateY(0deg)]",
        )}
      >
        {/* Front */}
        <div
          className="absolute inset-y-0 left-0 size-full overflow-hidden rounded-lg bg-neutral-800"
          style={{
            transform: `translateZ(${zDepth}px)`,
            boxShadow: `
              0 1px 2px var(--book-shadow-1),
              0 6px 14px -4px var(--book-shadow-2),
              0 14px 32px -8px var(--book-shadow-1)
            `
              .replace(/\s+/g, " ")
              .trim(),
          }}
        >
          {coverUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN URLs */}
              <img
                src={coverUrl}
                alt={coverAlt}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10"
                aria-hidden
              />
            </>
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-neutral-600 to-neutral-900"
              role="img"
              aria-label={coverAlt}
            />
          )}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full"
            style={glossStyle}
            aria-hidden
          />
          {badge ? (
            <div className="relative z-[2] flex justify-start p-2">{badge}</div>
          ) : null}
        </div>

        {/* Spine */}
        <div
          className="absolute left-0 bg-white"
          style={{
            top: "3px",
            bottom: "3px",
            width: spineWidth,
            transform: `translateX(${spineTranslateX}px) rotateY(90deg)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,1) 50%, rgba(249,249,249,1) 50%)",
            boxShadow: "inset -1px 0 2px rgba(0,0,0,0.08)",
          }}
          aria-hidden
        />

        {/* Back */}
        <div
          className="absolute inset-y-0 left-0 size-full overflow-hidden rounded-lg bg-neutral-900"
          style={{
            transform: `translateZ(-${zDepth}px)`,
            boxShadow: `
              -4px 0 16px -4px var(--book-shadow-1),
              -10px 0 28px -8px var(--book-shadow-2)
            `
              .replace(/\s+/g, " ")
              .trim(),
          }}
          aria-hidden
        >
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- same CDN as front
            <img
              src={coverUrl}
              alt=""
              className="size-full object-cover brightness-[0.28] saturate-[0.85]"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-neutral-800 to-neutral-950" />
          )}
        </div>
      </div>
    </div>
  );
}
