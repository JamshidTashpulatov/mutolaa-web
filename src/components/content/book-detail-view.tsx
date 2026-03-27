"use client";

import {
  Breadcrumbs,
  Link,
  Separator,
  Text,
  buttonVariants,
  cn,
} from "@heroui/react";
import { AppContainer } from "@/components/layout/app-container";
import { ReviewList } from "@/components/content/review-list";
import type { Dictionary } from "@/i18n/types";
import type { BookDetailExtended } from "@/lib/catalog";

function IconBookOpen({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export type BookDetailViewProps = {
  book: BookDetailExtended;
  genreLabel: string;
  reviews: { quote: string; attribution: string }[];
  dictionary: Dictionary;
  locale: string;
};

export function BookDetailView({
  book,
  genreLabel,
  reviews,
  dictionary: d,
  locale,
}: BookDetailViewProps) {
  const yearDisplay =
    book.year > 0 ? String(book.year) : "—";

  const readHref = `/${locale}/books/${book.slug}/read`;

  return (
    <AppContainer className="pb-16 pt-8">
      <Breadcrumbs className="mb-10">
        <Breadcrumbs.Item href={`/${locale}`}>
          {d.breadcrumbs.home}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/${locale}/catalog`}>
          {d.breadcrumbs.catalog}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/${locale}/books/${book.slug}`}>
          {book.title}
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,12rem)_1fr] lg:items-start lg:gap-14">
        <div className="mx-auto w-full max-w-[12rem] lg:mx-0">
          <div
            id="read"
            className="relative aspect-[2/3] w-full scroll-mt-24 overflow-hidden rounded-3xl bg-surface-secondary shadow-surface ring-1 ring-border"
          >
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote API URLs vary by host
              <img
                src={book.coverUrl}
                alt={`${d.book.coverFallback}: ${book.title}`}
                className="absolute inset-0 h-full w-full object-cover"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="absolute inset-0"
                role="img"
                aria-label={`${d.book.coverFallback}: ${book.title}`}
              />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {book.title}
          </h1>
          <Text size="lg" variant="muted" className="mt-3 text-pretty">
            {book.author}
          </Text>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="inline text-muted">{d.book.yearLabel}: </dt>
              <dd className="inline text-foreground">{yearDisplay}</dd>
            </div>
            <div>
              <dt className="inline text-muted">{d.catalog.genreLabel}: </dt>
              <dd className="inline text-foreground">{genreLabel}</dd>
            </div>
          </dl>

          <Separator className="my-8" />

          <Text size="sm" variant="muted" className="mb-3 font-medium">
            {d.book.synopsis}
          </Text>
          <Text className="max-w-prose text-pretty text-base leading-relaxed">
            {book.synopsis}
          </Text>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {(book.hasEbook || book.hasAudiobook) ? (
              <div
                className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface-secondary/60 p-1 shadow-sm"
                role="group"
                aria-label="Kitob harakatlari"
              >
                {book.hasEbook ? (
                  <Link
                    href={readHref}
                    className={cn(
                      buttonVariants({ variant: "primary", size: "md" }),
                      "inline-flex items-center gap-2 rounded-lg px-4",
                    )}
                  >
                    <IconBookOpen className="opacity-90" />
                    {d.book.readMutolaa}
                  </Link>
                ) : null}
                {book.hasAudiobook ? (
                  book.audiobookFragmentUrl ? (
                    <a
                      href={book.audiobookFragmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "md" }),
                        "inline-flex items-center gap-2 rounded-lg border border-border px-4",
                      )}
                    >
                      <IconHeadphones className="opacity-90" />
                      {d.book.listen}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "md" }),
                        "inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-dashed border-border px-4 opacity-60",
                      )}
                      title={d.book.listenUnavailable}
                    >
                      <IconHeadphones className="opacity-90" />
                      {d.book.listen}
                    </span>
                  )
                ) : null}
              </div>
            ) : null}

            <Link
              href={`/${locale}/catalog`}
              className={cn(
                buttonVariants({ variant: "tertiary", size: "md" }),
                "w-full justify-center sm:w-auto",
              )}
            >
              {d.book.backToCatalog}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <ReviewList
          title={d.book.reviewsHeading}
          titleId="book-reviews-heading"
          items={reviews}
        />
      </div>
    </AppContainer>
  );
}
