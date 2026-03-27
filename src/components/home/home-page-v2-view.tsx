"use client";

import { Link, Text, cn } from "@heroui/react";
import { useMemo } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { useDictionary } from "@/i18n/dictionary-context";
import { BookCard } from "@/components/content/book-card";
import { buildHomeCategoryChips } from "@/lib/nav-mega-categories";
import type { CatalogBook } from "@/lib/catalog";
import { buildHomeFeed, type HomeListedBook } from "@/lib/home-feed";
import { HomeBookRow } from "./home-book-row";

export type HomePageV2ViewProps = {
  locale: Locale;
  books: CatalogBook[];
};

function mapBooksToCards(
  books: HomeListedBook[],
  locale: Locale,
  d: Dictionary,
) {
  return books.map((book) => (
    <BookCard
      key={book.slug}
      title={book.title}
      author={book.author}
      href={`/${locale}/books/${book.slug}`}
      coverAlt={`${d.book.coverFallback}: ${book.title}`}
      coverUrl={book.coverUrl}
      size="rail"
    />
  ));
}

function HeroShelfBooks({
  books,
  locale,
  coverFallback,
}: {
  books: HomeListedBook[];
  locale: Locale;
  coverFallback: string;
}) {
  const row = books.slice(0, 5);
  if (row.length === 0) {
    return null;
  }
  return (
    <div className="relative mt-8 w-full px-2 sm:mt-10">
      <div className="mx-auto flex max-w-[540px] justify-center gap-2 sm:gap-3 md:gap-4">
        {row.map((book) => (
          <Link
            key={book.slug}
            href={`/${locale}/books/${book.slug}`}
            className="group relative w-[17%] min-w-[52px] max-w-[92px] flex-1"
          >
            <div
              className={cn(
                "aspect-[2/3] overflow-hidden rounded-xl bg-neutral-200",
                "shadow-[0_10px_28px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06]",
                "transition-transform duration-200 group-hover:-translate-y-1",
              )}
            >
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- dynamic catalog URLs
                <img
                  src={book.coverUrl}
                  alt={`${coverFallback}: ${book.title}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 p-1 text-center text-[10px] font-medium leading-tight text-neutral-600">
                  {book.title}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div
        className="mx-auto mt-1 h-3 max-w-[min(100%,480px)] rounded-sm bg-gradient-to-b from-[#d4b896] via-[#a67c52] to-[#6b4a32] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
        aria-hidden
      />
      <div
        className="mx-auto -mt-px h-2 max-w-[min(100%,500px)] rounded-b-md bg-gradient-to-b from-[#5c3d2e] to-[#3d2920] opacity-90"
        aria-hidden
      />
    </div>
  );
}

export function HomePageV2View({ locale, books }: HomePageV2ViewProps) {
  const { dictionary: d } = useDictionary();
  const feed = useMemo(() => buildHomeFeed(books, locale), [books, locale]);

  const homeCategories = buildHomeCategoryChips(locale, d.nav.megaCategories);

  const heroBooks = useMemo(() => {
    const seen = new Set<string>();
    const out: HomeListedBook[] = [];
    const pool = [
      ...feed.recommendations,
      ...feed.mostRead,
      ...feed.newlyAdded,
    ];
    for (const b of pool) {
      if (!seen.has(b.slug)) {
        seen.add(b.slug);
        out.push(b);
      }
      if (out.length >= 5) {
        break;
      }
    }
    return out;
  }, [feed]);

  const starterFive = useMemo(
    () => feed.recommendations.slice(0, 5),
    [feed.recommendations],
  );
  const audioFive = useMemo(
    () => feed.audiobooks.slice(0, 5),
    [feed.audiobooks],
  );

  const catalogHref = `/${locale}/catalog`;

  return (
    <div className="min-h-full bg-[#f0f0f1] font-sans text-neutral-900 antialiased">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <section
          className="overflow-hidden rounded-2xl bg-white px-5 py-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:px-8 sm:py-10 md:px-10 md:py-12"
          aria-labelledby="home-v2-hero-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h1
              id="home-v2-hero-heading"
              className="text-balance text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-[1.75rem] md:leading-snug"
            >
              {d.homeV2.heroTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-neutral-500 sm:text-base">
              {d.homeV2.heroSubtitle}
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href={catalogHref}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full bg-[#FF6900] px-8 text-sm font-semibold text-white shadow-sm",
                  "transition-opacity hover:opacity-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6900]",
                )}
              >
                {d.homeV2.heroCta}
              </Link>
            </div>
          </div>
          <HeroShelfBooks
            books={heroBooks}
            locale={locale}
            coverFallback={d.book.coverFallback}
          />
        </section>

        <section
          className="mt-8 sm:mt-10"
          aria-labelledby="home-v2-all-books"
        >
          <h2
            id="home-v2-all-books"
            className="mb-4 text-lg font-semibold tracking-tight text-neutral-900"
          >
            {d.homeV2.allBooksTitle}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {homeCategories.map(({ id, label, href }) => (
              <Link
                key={id}
                href={href}
                className={cn(
                  "inline-flex items-center rounded-full border border-neutral-200/90 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm",
                  "transition-colors hover:border-neutral-300 hover:bg-neutral-50",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6900]",
                )}
              >
                #{label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12" aria-labelledby="shelf-v2-starter">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2
              id="shelf-v2-starter"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              {d.homeV2.shelfStarter}
            </h2>
            <Link
              href={catalogHref}
              className="shrink-0 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              {d.homeV2.seeAll}
            </Link>
          </div>
          <div className="-mx-4 rounded-2xl bg-white/40 px-0 py-1 sm:-mx-6 sm:bg-transparent sm:px-0">
            <HomeBookRow className="sm:-mx-0">
              {mapBooksToCards(starterFive, locale, d)}
            </HomeBookRow>
          </div>
        </section>

        <section className="mt-8 sm:mt-10" aria-labelledby="shelf-v2-audio">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2
              id="shelf-v2-audio"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              {d.homeV2.shelfShortestAudio}
            </h2>
            <Link
              href={catalogHref}
              className="shrink-0 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              {d.homeV2.seeAll}
            </Link>
          </div>
          <div className="-mx-4 rounded-2xl bg-white/40 px-0 py-1 sm:-mx-6 sm:bg-transparent sm:px-0">
            <HomeBookRow className="sm:-mx-0">
              {mapBooksToCards(audioFive, locale, d)}
            </HomeBookRow>
          </div>
        </section>

        <div className="mt-12 border-t border-neutral-200/80 pb-8 pt-8 sm:mt-14 sm:pb-10">
          <Text
            size="sm"
            variant="muted"
            className="max-w-prose text-pretty leading-relaxed"
          >
            {d.home.closingNote}
          </Text>
        </div>
      </div>
    </div>
  );
}
