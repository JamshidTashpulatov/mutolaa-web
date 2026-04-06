"use client";

import {
  Button,
  buttonVariants,
  cn,
  Dropdown,
  Popover,
  SearchField,
  Separator,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type Ref,
} from "react";
import { extractEpubPages } from "@/lib/epub-extract";
import {
  ReaderPageTextBody,
  type ReaderHighlight,
  type ReaderSearchMatch,
} from "@/lib/reader-page-text";
import {
  closestReaderTextRoot,
  rangeOffsetsWithinRoot,
} from "@/lib/reader-selection";
import "./book-reader-physical.css";

const FONT_STACKS = {
  georgia: `Georgia, 'Times New Roman', ui-serif, serif`,
  palatino: `'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif`,
  charter: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
  sans: `ui-sans-serif, system-ui, sans-serif`,
} as const;

type FontId = keyof typeof FONT_STACKS;

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    flip: (page: number, corner?: "top" | "bottom") => void;
  };
};

type FlipPageProps = {
  children: React.ReactNode;
  className?: string;
  /** `cover` = muqova; `left`/`right` = matn betlari (gutter gradient uchun) */
  variant?: "cover" | "left" | "right";
};

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(function FlipPage(
  { children, className, variant = "left" },
  ref,
) {
  if (variant === "cover") {
    return (
      <div
        ref={ref}
        className={cn(
          "reader-page--cover box-border h-full max-h-full min-h-0 overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  const side =
    variant === "left" ? "reader-page--verso" : "reader-page--recto";

  return (
    <div
      ref={ref}
      className={cn(
        "reader-page reader-page--paper box-border flex h-full max-h-full min-h-0 flex-col overflow-hidden",
        side,
        "px-7 pb-10 pt-9 sm:px-9 sm:pb-12 sm:pt-10 md:px-11 md:pb-14 md:pt-12",
        className,
      )}
    >
      {children}
    </div>
  );
});

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

function IconHighlight({ className }: { className?: string }) {
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
      <path d="m9 11-6 6v3h3l6-6" />
      <path d="m22 7-8.5 8.5-3-3L19 4l3 3Z" />
      <path d="m15 5 3 3" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
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
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
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
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
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
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconType({ className }: { className?: string }) {
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
      aria-hidden
    >
      <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  );
}

function IconCase({ className }: { className?: string }) {
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
      aria-hidden
    >
      <path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function mergeHighlightRanges(
  prev: ReaderHighlight[],
  next: ReaderHighlight,
): ReaderHighlight[] {
  const samePage = prev.filter((h) => h.page === next.page);
  const other = prev.filter((h) => h.page !== next.page);
  const merged: { start: number; end: number }[] = [];
  const sorted = [
    ...samePage.map((h) => ({ start: h.start, end: h.end })),
    { start: next.start, end: next.end },
  ]
    .map((r) => ({
      start: Math.min(r.start, r.end),
      end: Math.max(r.start, r.end),
    }))
    .filter((r) => r.end > r.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  for (const r of sorted) {
    const last = merged[merged.length - 1];
    if (!last || r.start > last.end) {
      merged.push({ ...r });
    } else {
      last.end = Math.max(last.end, r.end);
    }
  }
  return [
    ...other,
    ...merged.map((r) => ({ page: next.page, start: r.start, end: r.end })),
  ];
}

function sanitizeHighlights(
  list: ReaderHighlight[],
  pageBodies: string[],
): ReaderHighlight[] {
  return list.filter((h) => {
    const t = pageBodies[h.page];
    if (!t) {
      return false;
    }
    return (
      h.start >= 0 &&
      h.end <= t.length &&
      h.start < h.end &&
      Number.isFinite(h.start) &&
      Number.isFinite(h.end)
    );
  });
}

function buildSearchMatches(
  pageBodies: string[],
  query: string,
): ReaderSearchMatch[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) {
    return [];
  }
  const out: ReaderSearchMatch[] = [];
  let globalIndex = 0;
  pageBodies.forEach((body, page) => {
    const lower = body.toLowerCase();
    let pos = 0;
    while (pos < lower.length) {
      const i = lower.indexOf(q, pos);
      if (i < 0) {
        break;
      }
      out.push({
        page,
        start: i,
        end: i + q.length,
        globalIndex: globalIndex++,
      });
      pos = i + Math.max(1, q.length);
    }
  });
  return out;
}

export type BookEpubFlipReaderProps = {
  epubUrl: string;
  title: string;
  coverFallbackUrl: string | null;
  backHref: string;
  /** localStorage kaliti (masalan kitob `slug`) */
  readerStorageId: string;
  labels: {
    close: string;
    prev: string;
    next: string;
    loading: string;
    error: string;
    empty: string;
    readerToolbarHighlight: string;
    readerToolbarSearch: string;
    readerToolbarLight: string;
    readerToolbarDark: string;
    readerToolbarThemeToggle: string;
    readerToolbarFontSize: string;
    readerToolbarFontFamily: string;
    readerToolbarSmaller: string;
    readerToolbarLarger: string;
    readerToolbarSearchPlaceholder: string;
    readerToolbarSearchPrev: string;
    readerToolbarSearchNext: string;
    readerToolbarMatchOf: string;
    readerToolbarNoMatches: string;
    readerToolbarSelectTextHint: string;
    readerFontSerifGeorgia: string;
    readerFontSerifPalatino: string;
    readerFontSerifCharter: string;
    readerFontSans: string;
  };
};

function toAbsoluteEpubUrl(epubUrl: string): string {
  if (epubUrl.startsWith("http://") || epubUrl.startsWith("https://")) {
    return epubUrl;
  }
  if (typeof window === "undefined") {
    return epubUrl;
  }
  return new URL(epubUrl, window.location.origin).href;
}

function prefsStorageKey(id: string) {
  return `mutolaa.reader.prefs.${id}`;
}

function highlightsStorageKey(id: string) {
  return `mutolaa.reader.highlights.${id}`;
}

export function BookEpubFlipReader({
  epubUrl,
  title,
  coverFallbackUrl,
  backHref,
  readerStorageId,
  labels: lb,
}: BookEpubFlipReaderProps) {
  const router = useRouter();
  const bookRef = useRef<FlipBookRef | null>(null);
  const [HTMLFlipBook, setHTMLFlipBook] =
    useState<ComponentType<Record<string, unknown>> | null>(null);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });
  const [pages, setPages] = useState<string[] | null>(null);
  const [epubCover, setEpubCover] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<ReaderHighlight[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSizePx, setFontSizePx] = useState(17);
  const [fontId, setFontId] = useState<FontId>("georgia");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  /** Tugma bosilganda tanlov yo‘qolishi; oxirgi reader Range */
  const savedReaderRangeRef = useRef<Range | null>(null);

  const absUrl = useMemo(() => toAbsoluteEpubUrl(epubUrl), [epubUrl]);

  useLayoutEffect(() => {
    const ro = () =>
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    ro();
    window.addEventListener("resize", ro);
    return () => window.removeEventListener("resize", ro);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(prefsStorageKey(readerStorageId));
      if (!raw) {
        return;
      }
      const p = JSON.parse(raw) as {
        theme?: string;
        fontSizePx?: number;
        fontId?: string;
      };
      if (p.theme === "dark" || p.theme === "light") {
        setTheme(p.theme);
      }
      if (
        typeof p.fontSizePx === "number" &&
        p.fontSizePx >= 14 &&
        p.fontSizePx <= 26
      ) {
        setFontSizePx(Math.round(p.fontSizePx));
      }
      if (p.fontId && p.fontId in FONT_STACKS) {
        setFontId(p.fontId as FontId);
      }
    } catch {
      /* noop */
    }
  }, [readerStorageId]);

  useEffect(() => {
    try {
      localStorage.setItem(
        prefsStorageKey(readerStorageId),
        JSON.stringify({ theme, fontSizePx, fontId }),
      );
    } catch {
      /* noop */
    }
  }, [readerStorageId, theme, fontSizePx, fontId]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 280);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setActiveMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    setPages(null);
    setLoadError(null);
    setEpubCover(null);
    setHTMLFlipBook(null);

    Promise.all([
      import("react-pageflip").then((m) => m.default),
      extractEpubPages(absUrl),
    ])
      .then(([FlipMod, epubData]) => {
        if (cancelled) {
          return;
        }
        setHTMLFlipBook(
          () => FlipMod as unknown as ComponentType<Record<string, unknown>>,
        );
        setPages(epubData.pages);
        setEpubCover(epubData.epubCoverUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(lb.error);
          setPages(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [absUrl, lb.error]);

  useEffect(() => {
    if (!pages?.length) {
      return;
    }
    try {
      const raw = localStorage.getItem(highlightsStorageKey(readerStorageId));
      if (!raw) {
        setHighlights([]);
        return;
      }
      const parsed = JSON.parse(raw) as ReaderHighlight[];
      if (!Array.isArray(parsed)) {
        setHighlights([]);
        return;
      }
      setHighlights(sanitizeHighlights(parsed, pages));
    } catch {
      setHighlights([]);
    }
  }, [readerStorageId, pages]);

  const pageW = Math.max(260, Math.floor((viewport.w * 0.94) / 2));
  const pageH = Math.max(400, Math.floor(viewport.h * 0.9));
  const usePortrait = viewport.w < 720;

  const boardMetrics = useMemo(
    () => ({
      width: pageW * 2 + 8,
      height: pageH + 14,
    }),
    [pageW, pageH],
  );

  const flipNext = useCallback(() => {
    try {
      bookRef.current?.pageFlip()?.flipNext();
    } catch {
      /* noop */
    }
  }, []);

  const flipPrev = useCallback(() => {
    try {
      bookRef.current?.pageFlip()?.flipPrev();
    } catch {
      /* noop */
    }
  }, []);

  const flipToContentPage = useCallback((contentPageIndex: number) => {
    try {
      bookRef.current?.pageFlip()?.flip(contentPageIndex + 1, "top");
    } catch {
      /* noop */
    }
  }, []);

  const searchMatches = useMemo(
    () => buildSearchMatches(pages ?? [], searchQuery),
    [pages, searchQuery],
  );

  useEffect(() => {
    const ready = Boolean(pages?.length && HTMLFlipBook && !loadError);
    if (!ready || searchMatches.length === 0) {
      return;
    }
    const idx = Math.min(activeMatchIndex, searchMatches.length - 1);
    const m = searchMatches[idx];
    if (m) {
      flipToContentPage(m.page);
    }
  }, [
    activeMatchIndex,
    searchMatches,
    pages,
    HTMLFlipBook,
    loadError,
    flipToContentPage,
  ]);

  useEffect(() => {
    const ready = Boolean(pages?.length && HTMLFlipBook && !loadError);
    if (!ready) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        flipNext();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        flipPrev();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        router.push(backHref);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages, HTMLFlipBook, loadError, flipNext, flipPrev, router, backHref]);

  const ready = Boolean(pages?.length && HTMLFlipBook && !loadError);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        return;
      }
      if (sel.isCollapsed) {
        return;
      }
      let range: Range;
      try {
        range = sel.getRangeAt(0);
      } catch {
        return;
      }
      const root = closestReaderTextRoot(range.commonAncestorContainer);
      if (!root) {
        savedReaderRangeRef.current = null;
        return;
      }
      try {
        savedReaderRangeRef.current = range.cloneRange();
      } catch {
        savedReaderRangeRef.current = null;
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [ready]);

  const applyHighlight = useCallback(() => {
    if (!pages?.length) {
      return;
    }
    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      try {
        range = sel.getRangeAt(0);
      } catch {
        range = null;
      }
    }
    if (!range && savedReaderRangeRef.current) {
      try {
        range = savedReaderRangeRef.current.cloneRange();
      } catch {
        range = null;
      }
    }
    if (!range) {
      return;
    }
    const root = closestReaderTextRoot(range.commonAncestorContainer);
    if (!root) {
      return;
    }
    const pageAttr = root.dataset.pageIndex;
    if (pageAttr === undefined) {
      return;
    }
    const pageIndex = Number(pageAttr);
    if (!Number.isFinite(pageIndex) || pageIndex < 0 || pageIndex >= pages.length) {
      return;
    }
    const off = rangeOffsetsWithinRoot(root, range);
    if (!off || off.start === off.end) {
      return;
    }
    setHighlights((prev) => {
      const next = mergeHighlightRanges(prev, {
        page: pageIndex,
        start: off.start,
        end: off.end,
      });
      const cleaned = sanitizeHighlights(next, pages);
      try {
        localStorage.setItem(
          highlightsStorageKey(readerStorageId),
          JSON.stringify(cleaned),
        );
      } catch {
        /* noop */
      }
      return cleaned;
    });
    savedReaderRangeRef.current = null;
    window.getSelection()?.removeAllRanges();
  }, [pages, readerStorageId]);

  const coverSrc = epubCover ?? coverFallbackUrl;
  const FlipBook = HTMLFlipBook as unknown as ComponentType<
    Record<string, unknown> & { ref?: Ref<FlipBookRef | null> }
  >;

  const pageBodyClass =
    "reader-page-body-text min-h-0 flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-line text-justify tracking-[0.01em] [hyphens:auto]";

  const fontLabel: Record<FontId, string> = {
    georgia: lb.readerFontSerifGeorgia,
    palatino: lb.readerFontSerifPalatino,
    charter: lb.readerFontSerifCharter,
    sans: lb.readerFontSans,
  };

  const matchLabel =
    searchMatches.length === 0
      ? lb.readerToolbarNoMatches
      : lb.readerToolbarMatchOf
          .replace("{current}", String(activeMatchIndex + 1))
          .replace("{total}", String(searchMatches.length));

  const goSearchPrev = useCallback(() => {
    if (searchMatches.length === 0) {
      return;
    }
    setActiveMatchIndex((i) =>
      i <= 0 ? searchMatches.length - 1 : i - 1,
    );
  }, [searchMatches.length]);

  const goSearchNext = useCallback(() => {
    if (searchMatches.length === 0) {
      return;
    }
    setActiveMatchIndex((i) =>
      i >= searchMatches.length - 1 ? 0 : i + 1,
    );
  }, [searchMatches.length]);

  return (
    <div
      className={cn(
        "reader-physical-root reader-book fixed inset-0 z-[100] flex flex-col",
        theme === "dark" && "reader-theme-dark",
      )}
      style={
        {
          fontFamily: FONT_STACKS[fontId],
          ["--reader-font-size" as string]: `${fontSizePx}px`,
        } as CSSProperties
      }
    >
      <Link
        href={backHref}
        aria-label={lb.close}
        className={cn(
          "pointer-events-auto absolute left-4 top-4 z-30 flex size-11 items-center justify-center rounded-full",
          theme === "light"
            ? "bg-neutral-900 text-white shadow-lg hover:bg-neutral-800"
            : "bg-stone-100 text-stone-900 shadow-lg hover:bg-white",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        )}
      >
        <IconClose className="size-5" />
      </Link>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 pb-28 pt-5 sm:px-8 sm:pb-32 sm:pt-8 md:px-12 md:pt-10">
        {loadError ? (
          <div
            className={cn(
              "max-w-md px-6 text-center text-sm",
              theme === "light" ? "text-neutral-700" : "text-stone-300",
            )}
          >
            <p>{loadError}</p>
            <Link
              href={backHref}
              className={cn(
                "mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-medium text-white",
                theme === "light"
                  ? "bg-neutral-900 hover:bg-neutral-800"
                  : "bg-amber-600 hover:bg-amber-500",
              )}
            >
              {lb.close}
            </Link>
          </div>
        ) : !ready ? (
          <div
            className={cn(
              "text-sm",
              theme === "light" ? "text-neutral-700" : "text-stone-300",
            )}
            aria-busy
          >
            {lb.loading}
          </div>
        ) : (
          <div className="reader-physical-volume relative mx-auto inline-block max-w-full">
            <div
              className="reader-physical-board"
              style={{
                width: boardMetrics.width,
                height: boardMetrics.height,
              }}
              aria-hidden
            />
            <div className="reader-physical-flip-inner">
              <FlipBook
                ref={bookRef}
                startPage={0}
                width={pageW}
                height={pageH}
                size="fixed"
                minWidth={260}
                maxWidth={pageW}
                minHeight={400}
                maxHeight={pageH}
                maxShadowOpacity={usePortrait ? 0.1 : 0.05}
                drawShadow
                flippingTime={1050}
                usePortrait={usePortrait}
                showCover
                showPageCorners={false}
                mobileScrollSupport
                useMouseEvents
                swipeDistance={24}
                autoSize={false}
                startZIndex={0}
                clickEventForward
                disableFlipByClick={false}
                className="reader-flip-root"
              >
                <FlipPage key="cover" variant="cover">
                  <div className="flex h-full flex-col items-center justify-center bg-[#2a2623] p-8">
                    {coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverSrc}
                        alt=""
                        className="max-h-[78%] max-w-[85%] object-contain shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-[45%] max-w-[200px] items-center justify-center bg-[#3d3835] font-serif text-4xl font-medium text-[#a8a29e]">
                        {title.slice(0, 1)}
                      </div>
                    )}
                  </div>
                </FlipPage>
                {(pages ?? []).map((body, i) => (
                  <FlipPage
                    key={`p-${i}`}
                    variant={i % 2 === 0 ? "left" : "right"}
                  >
                    <div className="reader-page__content flex h-full min-h-0 flex-col text-[color:var(--reader-ink)]">
                      <ReaderPageTextBody
                        text={body}
                        pageIndex={i}
                        highlights={highlights}
                        searchMatchesOnPage={searchMatches.filter(
                          (m) => m.page === i,
                        )}
                        activeSearchGlobalIndex={
                          searchMatches[activeMatchIndex]?.globalIndex ?? -1
                        }
                        className={pageBodyClass}
                      />
                    </div>
                  </FlipPage>
                ))}
              </FlipBook>
            </div>
          </div>
        )}
      </div>

      {ready ? (
        <div
          className={cn(
            "reader-bottom-toolbar pointer-events-auto fixed bottom-5 left-1/2 z-40 flex max-w-[min(100vw-1.5rem,44rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl px-2 py-2 sm:gap-1.5 sm:px-3",
            theme === "light"
              ? "reader-bottom-toolbar--light border border-white/60 bg-white/92 text-neutral-800 backdrop-blur-md"
              : "reader-bottom-toolbar--dark border border-stone-500/55 bg-zinc-800 text-stone-50 shadow-lg backdrop-blur-md",
          )}
          role="toolbar"
          aria-label="Reader tools"
        >
          <span className="inline-flex shrink-0" title={lb.readerToolbarSelectTextHint}>
            <Button
              size="sm"
              variant="ghost"
              isIconOnly
              aria-label={lb.readerToolbarHighlight}
              onPress={applyHighlight}
              className={cn(
                theme === "light"
                  ? "text-neutral-800 hover:bg-neutral-100"
                  : "text-stone-50 hover:bg-white/15 [&_svg]:stroke-stone-50",
              )}
            >
              <IconHighlight className="size-5" />
            </Button>
          </span>

          <Popover>
            <Popover.Trigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "size-9 min-w-0 shrink-0 p-0",
                theme === "light"
                  ? "text-neutral-800 hover:bg-neutral-100"
                  : "text-stone-50 hover:bg-white/15 [&_svg]:stroke-stone-50",
              )}
              aria-label={lb.readerToolbarSearch}
            >
              <IconSearch className="size-5" />
            </Popover.Trigger>
            <Popover.Content className="w-[min(calc(100vw-2rem),20rem)] p-3">
              <div className="flex flex-col gap-3">
                <SearchField
                  value={searchInput}
                  onChange={setSearchInput}
                  aria-label={lb.readerToolbarSearch}
                  className="w-full"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input
                      placeholder={lb.readerToolbarSearchPlaceholder}
                    />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted text-xs">{matchLabel}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={searchMatches.length === 0}
                      aria-label={lb.readerToolbarSearchPrev}
                      onPress={goSearchPrev}
                    >
                      ‹
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={searchMatches.length === 0}
                      aria-label={lb.readerToolbarSearchNext}
                      onPress={goSearchNext}
                    >
                      ›
                    </Button>
                  </div>
                </div>
              </div>
            </Popover.Content>
          </Popover>

          <Separator
            orientation="vertical"
            className={cn(
              "mx-0.5 h-7 data-[orientation=vertical]:h-7",
              theme === "dark" && "bg-stone-500/70",
            )}
          />

          <span
            className="inline-flex shrink-0"
            title={
              theme === "light"
                ? lb.readerToolbarDark
                : lb.readerToolbarLight
            }
          >
            <Button
              size="sm"
              variant="ghost"
              isIconOnly
              aria-label={lb.readerToolbarThemeToggle}
              aria-pressed={theme === "dark"}
              onPress={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className={cn(
                theme === "light"
                  ? "text-neutral-800 hover:bg-neutral-100"
                  : "text-stone-50 hover:bg-white/15 [&_svg]:stroke-stone-50",
              )}
            >
              {theme === "light" ? (
                <IconMoon className="size-5" />
              ) : (
                <IconSun className="size-5" />
              )}
            </Button>
          </span>

          <Separator
            orientation="vertical"
            className={cn(
              "mx-0.5 h-7 data-[orientation=vertical]:h-7",
              theme === "dark" && "bg-stone-500/70",
            )}
          />

          <Popover>
            <Popover.Trigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "size-9 min-w-0 shrink-0 p-0",
                theme === "light"
                  ? "text-neutral-800 hover:bg-neutral-100"
                  : "text-stone-50 hover:bg-white/15 [&_svg]:stroke-stone-50",
              )}
              aria-label={lb.readerToolbarFontSize}
            >
              <IconType className="size-5" />
            </Popover.Trigger>
            <Popover.Content className="min-w-[12rem] p-3">
              <p className="mb-2 text-xs font-medium opacity-80">
                {lb.readerToolbarFontSize}
              </p>
              <div className="flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={lb.readerToolbarSmaller}
                  isDisabled={fontSizePx <= 14}
                  onPress={() =>
                    setFontSizePx((s) => Math.max(14, s - 1))
                  }
                >
                  A−
                </Button>
                <span className="tabular-nums text-sm font-medium">
                  {fontSizePx}px
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={lb.readerToolbarLarger}
                  isDisabled={fontSizePx >= 26}
                  onPress={() =>
                    setFontSizePx((s) => Math.min(26, s + 1))
                  }
                >
                  A+
                </Button>
              </div>
            </Popover.Content>
          </Popover>

          <Dropdown>
            <Dropdown.Trigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "size-9 min-w-0 shrink-0 p-0",
                theme === "light"
                  ? "text-neutral-800 hover:bg-neutral-100"
                  : "text-stone-50 hover:bg-white/15 [&_svg]:stroke-stone-50",
              )}
              aria-label={lb.readerToolbarFontFamily}
            >
              <IconCase className="size-5" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="top">
              <Dropdown.Menu aria-label={lb.readerToolbarFontFamily}>
                {(Object.keys(FONT_STACKS) as FontId[]).map((id) => (
                  <Dropdown.Item
                    key={id}
                    id={id}
                    textValue={fontLabel[id]}
                    onClick={() => setFontId(id)}
                  >
                    {fontLabel[id]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      ) : null}

      <p className="sr-only">
        {lb.prev} — chap o‘q. {lb.next} — o‘ng o‘q. {lb.close} — Escape.
      </p>
    </div>
  );
}
