"use client";

import { cn } from "@heroui/react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HomeShelfSlotContext } from "./home-shelf-slot-context";

type HomeBookRowProps = {
  children: ReactNode;
  className?: string;
  /**
   * `true` (default): full-bleed rail (negative horizontal margin) for AppContainer layouts.
   * `false`: stay inside padded parents (e.g. home-sidebar) to avoid horizontal scroll bugs.
   */
  bleed?: boolean;
};

function shelfColumns(scrollWidth: number): number {
  if (scrollWidth < 380) {
    return 2;
  }
  if (scrollWidth < 540) {
    return 3;
  }
  if (scrollWidth < 780) {
    return 4;
  }
  return 5;
}

function parseGapPx(track: HTMLElement): number {
  const s = getComputedStyle(track);
  const raw = s.gap || s.columnGap || "12px";
  const n = parseFloat(String(raw).trim().split(/\s+/)[0] ?? "");
  return Number.isFinite(n) && n > 0 ? n : 12;
}

/**
 * Home rails: card width = floor((scrollWidth − track padding − (cols−1)·gap) / cols)
 * so whole columns fit in the viewport (no half-cut cover on the right).
 */
export function HomeBookRow({
  children,
  className,
  bleed = true,
}: HomeBookRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slotPx, setSlotPx] = useState(148);

  const measure = useCallback(() => {
    const scroll = scrollRef.current;
    const track = scroll?.querySelector<HTMLElement>("[data-shelf-track]");
    if (!scroll || !track) {
      return;
    }

    const W = scroll.clientWidth;
    const pl = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const pr = parseFloat(getComputedStyle(track).paddingRight) || 0;
    const gap = parseGapPx(track);
    const usable = Math.max(0, W - pl - pr);

    let cols = shelfColumns(W);
    let slot = 148;
    for (;;) {
      const gutters = Math.max(0, cols - 1) * gap;
      const raw = cols > 0 ? (usable - gutters) / cols : usable;
      const next = Math.floor(raw);
      if (cols <= 1 || next >= 96) {
        slot = Math.max(72, Math.min(240, next));
        break;
      }
      cols -= 1;
    }
    setSlotPx(slot);
  }, []);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      return;
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(scroll);
    const track = scroll.querySelector<HTMLElement>("[data-shelf-track]");
    if (track) {
      ro.observe(track);
    }
    return () => {
      ro.disconnect();
    };
  }, [measure, children]);

  return (
    <HomeShelfSlotContext.Provider value={slotPx}>
      <div
        className={cn(
          "relative min-w-0 max-w-full",
          bleed ? "-mx-4 sm:-mx-6" : "mx-0",
          className,
        )}
      >
        <div
          ref={scrollRef}
          className={cn(
            "min-w-0 overflow-x-auto overscroll-x-contain",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            data-shelf-track
            className={cn(
              "flex w-max max-w-none flex-nowrap items-start gap-2.5 sm:gap-3",
              "py-4 pb-5 pt-3 sm:py-5 sm:pb-6 sm:pt-4",
              bleed
                ? "ps-4 pe-4 sm:ps-6 sm:pe-6 scroll-pl-3 scroll-pr-4 sm:scroll-pl-5 sm:scroll-pr-6"
                : "ps-1 pe-1 sm:ps-2 sm:pe-2 scroll-pl-1 scroll-pr-1 sm:scroll-pl-2 sm:scroll-pr-2",
            )}
          >
            {children}
            <div
              className="pointer-events-none w-px shrink-0 select-none sm:w-1.5 md:w-2"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </HomeShelfSlotContext.Provider>
  );
}
