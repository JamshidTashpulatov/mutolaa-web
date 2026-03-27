"use client";

import { cn } from "@heroui/react";
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
  type Ref,
} from "react";
import { extractEpubPages } from "@/lib/epub-extract";
import "./book-reader-physical.css";

type FlipBookRef = {
  pageFlip: () => { flipNext: () => void; flipPrev: () => void };
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

export type BookEpubFlipReaderProps = {
  epubUrl: string;
  title: string;
  author: string;
  coverFallbackUrl: string | null;
  backHref: string;
  labels: {
    close: string;
    prev: string;
    next: string;
    loading: string;
    error: string;
    empty: string;
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

export function BookEpubFlipReader({
  epubUrl,
  title,
  author: _author,
  coverFallbackUrl,
  backHref,
  labels,
}: BookEpubFlipReaderProps) {
  const router = useRouter();
  const bookRef = useRef<FlipBookRef | null>(null);
  const [HTMLFlipBook, setHTMLFlipBook] =
    useState<ComponentType<Record<string, unknown>> | null>(null);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });
  const [pages, setPages] = useState<string[] | null>(null);
  const [epubCover, setEpubCover] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
          setLoadError(labels.error);
          setPages(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [absUrl, labels.error]);

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

  const coverSrc = epubCover ?? coverFallbackUrl;
  const ready = Boolean(pages?.length && HTMLFlipBook && !loadError);
  const FlipBook = HTMLFlipBook as unknown as ComponentType<
    Record<string, unknown> & { ref?: Ref<FlipBookRef | null> }
  >;

  const pageBodyClass =
    "min-h-0 flex-1 overflow-hidden whitespace-pre-line text-justify font-serif text-[15px] leading-[1.68] tracking-[0.01em] text-neutral-900 sm:text-base sm:leading-[1.7] md:text-[17px] md:leading-[1.72] [hyphens:auto]";

  return (
    <div
      className="reader-physical-root reader-book fixed inset-0 z-[100] flex flex-col text-neutral-900"
      style={{ fontFamily: "Georgia, 'Times New Roman', ui-serif, serif" }}
    >
      <Link
        href={backHref}
        aria-label={labels.close}
        className={cn(
          "pointer-events-auto absolute left-4 top-4 z-30 flex size-11 items-center justify-center rounded-full",
          "bg-neutral-900 text-white shadow-lg transition-colors hover:bg-neutral-800",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        )}
      >
        <IconClose className="size-5" />
      </Link>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 py-5 sm:px-8 sm:py-8 md:px-12 md:py-10">
        {loadError ? (
          <div className="max-w-md px-6 text-center text-sm text-neutral-700">
            <p>{loadError}</p>
            <Link
              href={backHref}
              className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              {labels.close}
            </Link>
          </div>
        ) : !ready ? (
          <div className="text-sm text-neutral-700" aria-busy>
            {labels.loading}
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
                mobileScrollSupport={false}
                useMouseEvents
                swipeDistance={24}
                autoSize={false}
                startZIndex={0}
                clickEventForward={false}
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
                    <div className="reader-page__content flex h-full min-h-0 flex-col">
                      <div className={pageBodyClass}>
                        {body.trim() || "\u00A0"}
                      </div>
                    </div>
                  </FlipPage>
                ))}
              </FlipBook>
            </div>
          </div>
        )}
      </div>

      <p className="sr-only">
        {labels.prev} — chap o‘q. {labels.next} — o‘ng o‘q. {labels.close} — Escape.
      </p>
    </div>
  );
}
