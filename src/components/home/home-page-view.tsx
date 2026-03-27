"use client";

import { Link, Text } from "@heroui/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { useDictionary } from "@/i18n/dictionary-context";
import { BookCard } from "@/components/content/book-card";
import { AppContainer } from "@/components/layout/app-container";
import {
  CURATED_COLLECTION_ORDER,
  buildHomeFeed,
  curatedCollectionHref,
  type HomeListedBook,
} from "@/lib/home-feed";
import { buildHomeCategoryChips } from "@/lib/nav-mega-categories";
import type { CatalogBook } from "@/lib/catalog";
import { BookShelfSection } from "./book-shelf-section";
import { CuratedCollectionsSection } from "./curated-collections-section";
import { HomeCategoriesSection } from "./home-categories-section";

export type HomePageViewProps = {
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

export function HomePageView({ locale, books }: HomePageViewProps) {
  const { dictionary: d } = useDictionary();
  const feed = buildHomeFeed(books, locale);

  const homeCategories = buildHomeCategoryChips(locale, d.nav.megaCategories);

  const curatedItems = CURATED_COLLECTION_ORDER.map((id) => {
    const c = d.home.curatedCollections[id];
    return {
      id,
      title: c.title,
      description: c.description,
      href: curatedCollectionHref(locale, id),
    };
  });

  const catalogHref = `/${locale}/catalog`;

  return (
    <>
      <HomeCategoriesSection
        title={d.home.genreHubTitle}
        titleId="home-categories"
        categories={homeCategories}
      />

      <BookShelfSection
        title={d.home.shelf.mostRead}
        titleId="shelf-most-read"
        seeAllHref={catalogHref}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.mostRead, locale, d)}
      </BookShelfSection>

      <BookShelfSection
        title={d.home.shelf.newlyAdded}
        titleId="shelf-new"
        seeAllHref={catalogHref}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.newlyAdded, locale, d)}
      </BookShelfSection>

      <BookShelfSection
        title={d.home.shelf.recommendations}
        titleId="shelf-rec"
        seeAllHref={catalogHref}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.recommendations, locale, d)}
      </BookShelfSection>

      <BookShelfSection
        title={d.home.shelf.audiobooks}
        titleId="shelf-audio"
        seeAllHref={catalogHref}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.audiobooks, locale, d)}
      </BookShelfSection>

      <BookShelfSection
        title={d.home.shelf.uzbekLiterature}
        titleId="shelf-uzbek"
        seeAllHref={`${catalogHref}?genre=novel`}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.uzbekLiterature, locale, d)}
      </BookShelfSection>

      <BookShelfSection
        title={d.home.shelf.worldLiterature}
        titleId="shelf-world"
        seeAllHref={catalogHref}
        seeAllLabel={d.home.seeAll}
      >
        {mapBooksToCards(feed.worldLiterature, locale, d)}
      </BookShelfSection>

      <CuratedCollectionsSection
        heading={d.home.curatedHeading}
        titleId="home-curated"
        items={curatedItems}
        detailsLabel={d.home.details}
      />

      <AppContainer className="border-t border-border pb-16 pt-10 md:pb-20 md:pt-12">
        <Text size="sm" variant="muted" className="max-w-prose text-pretty leading-relaxed">
          {d.home.closingNote}
        </Text>
        <div className="mt-6">
          <Link
            href={catalogHref}
            className="text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            {d.nav.catalog} →
          </Link>
        </div>
      </AppContainer>
    </>
  );
}
