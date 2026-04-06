import { Fragment, type ReactNode, type SyntheticEvent } from "react";
import { cn } from "@heroui/react";

/** StPageFlip `stf__block` mousedown/touchstart olmasin — matn tanlash sahifa aylanmasin */
function stopFlipGesture(e: SyntheticEvent) {
  e.stopPropagation();
}

export type ReaderHighlight = { page: number; start: number; end: number };

export type ReaderSearchMatch = {
  page: number;
  start: number;
  end: number;
  globalIndex: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function mergeUserRanges(
  ranges: { start: number; end: number }[],
): { start: number; end: number }[] {
  const sorted = [...ranges]
    .map((r) => ({
      start: Math.max(0, Math.min(r.start, r.end)),
      end: Math.max(0, Math.max(r.start, r.end)),
    }))
    .filter((r) => r.end > r.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const out: { start: number; end: number }[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (!last || r.start > last.end) {
      out.push({ ...r });
    } else {
      last.end = Math.max(last.end, r.end);
    }
  }
  return out;
}

function collectBoundaries(
  len: number,
  extra: Iterable<{ start: number; end: number }>,
): number[] {
  const b = new Set<number>([0, len]);
  for (const r of extra) {
    b.add(clamp(r.start, 0, len));
    b.add(clamp(r.end, 0, len));
  }
  return [...b].sort((a, c) => a - c);
}

function intervalInside(
  a: number,
  b: number,
  ranges: { start: number; end: number }[],
): boolean {
  return ranges.some((r) => r.start <= a && b <= r.end);
}

export function ReaderPageTextBody({
  text,
  pageIndex,
  highlights,
  searchMatchesOnPage,
  activeSearchGlobalIndex,
  className,
}: {
  text: string;
  pageIndex: number;
  highlights: ReaderHighlight[];
  searchMatchesOnPage: ReaderSearchMatch[];
  activeSearchGlobalIndex: number;
  className?: string;
}) {
  const raw = text.trim() ? text : "\u00A0";
  const len = raw.length;
  const userRanges = mergeUserRanges(
    highlights.filter((h) => h.page === pageIndex).map((h) => ({ start: h.start, end: h.end })),
  );
  const searchRanges = searchMatchesOnPage.map((m) => ({
    start: m.start,
    end: m.end,
  }));

  const boundaries = collectBoundaries(len, [...userRanges, ...searchRanges]);
  const nodes: ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < boundaries.length - 1; i++) {
    const a = boundaries[i];
    const b = boundaries[i + 1];
    if (a === b) {
      continue;
    }
    const slice = raw.slice(a, b);
    const inUser = intervalInside(a, b, userRanges);
    const searchHit = searchMatchesOnPage.find(
      (m) => m.start <= a && b <= m.end,
    );
    const isActiveSearch =
      searchHit !== undefined && searchHit.globalIndex === activeSearchGlobalIndex;

    let inner: ReactNode = slice;
    if (searchHit) {
      inner = (
        <mark
          className={cn(
            "reader-search-hit rounded-sm px-0.5",
            isActiveSearch && "reader-search-hit--current",
          )}
        >
          {slice}
        </mark>
      );
    }
    if (inUser) {
      inner = (
        <mark className="reader-user-highlight rounded-sm px-0.5">{inner}</mark>
      );
    }
    nodes.push(<Fragment key={`f-${key++}`}>{inner}</Fragment>);
  }

  return (
    <div
      className={className}
      data-mutolaa-reader-text=""
      data-page-index={String(pageIndex)}
      onMouseDown={stopFlipGesture}
      onTouchStart={stopFlipGesture}
      onPointerDown={stopFlipGesture}
    >
      {nodes}
    </div>
  );
}
