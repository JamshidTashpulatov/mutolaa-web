"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Label,
  Link,
  Radio,
  RadioGroup,
  SearchField,
  Text,
  textVariants,
} from "@heroui/react";
import type { Dictionary } from "@/i18n/types";
import type { LocalizedBook } from "@/lib/catalog";
import {
  parseGenreParam,
  type GenreFilter,
} from "@/lib/catalog";
import { BookCard } from "@/components/content/book-card";
import { AppContainer } from "@/components/layout/app-container";

export function CatalogView({
  books,
  dictionary: d,
  locale,
}: {
  books: LocalizedBook[];
  dictionary: Dictionary;
  locale: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const genre = parseGenreParam(searchParams.get("genre"));

  const updateParams = (updates: { q?: string; genre?: GenreFilter }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.q !== undefined) {
      const t = updates.q.trim();
      if (t) {
        params.set("q", t);
      } else {
        params.delete("q");
      }
    }
    if (updates.genre !== undefined) {
      if (updates.genre === "all") {
        params.delete("genre");
      } else {
        params.set("genre", updates.genre);
      }
    }
    const qs = params.toString();
    router.replace(`/${locale}/catalog${qs ? `?${qs}` : ""}`);
  };

  const genreOptions: { value: GenreFilter; label: string }[] = [
    { value: "all", label: d.catalog.genres.all },
    { value: "novel", label: d.catalog.genres.novel },
    { value: "poetry", label: d.catalog.genres.poetry },
    { value: "drama", label: d.catalog.genres.drama },
    { value: "essays", label: d.catalog.genres.essays },
    { value: "folklore", label: d.catalog.genres.folklore },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (genre !== "all" && b.genre !== genre) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    });
  }, [books, genre, query]);

  const resultsLabel = d.catalog.resultsLine.replace(
    "{count}",
    String(filtered.length),
  );

  return (
    <AppContainer className="pb-16 pt-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-balance text-3xl font-semibold text-foreground">
          {d.catalog.title}
        </h1>
        <Text variant="muted" className="mt-3 text-pretty">
          {d.catalog.description}
        </Text>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <aside className="w-full shrink-0 lg:max-w-xs">
          <SearchField
            fullWidth
            value={query}
            onChange={(v) => updateParams({ q: v })}
            className="mb-8"
          >
            <Label>{d.catalog.searchLabel}</Label>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder={d.catalog.searchPlaceholder} />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <RadioGroup
            value={genre}
            onChange={(v) => updateParams({ genre: v as GenreFilter })}
            className="flex flex-col gap-3"
          >
            <div
              className={textVariants({
                size: "sm",
                variant: "muted",
                className: "mb-1 font-medium text-foreground",
              })}
            >
              {d.catalog.genreLabel}
            </div>
            {genreOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <span className="text-sm">{opt.label}</span>
                </Radio.Content>
              </Radio>
            ))}
          </RadioGroup>
        </aside>

        <div className="min-w-0 flex-1">
          <Text size="sm" variant="muted" className="mb-6">
            {resultsLabel}
          </Text>
          {filtered.length === 0 ? (
            <Text variant="muted">{d.catalog.empty}</Text>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-10 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {filtered.map((book) => (
                <li
                  key={book.slug}
                  className="flex justify-center sm:justify-start"
                >
                  <BookCard
                    title={book.title}
                    author={book.author}
                    href={`/${locale}/books/${book.slug}`}
                    coverAlt={`${d.book.coverFallback}: ${book.title}`}
                    coverUrl={book.coverUrl}
                    linkClassName="mx-auto sm:mx-0"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {d.breadcrumbs.home}
        </Link>
      </div>
    </AppContainer>
  );
}
