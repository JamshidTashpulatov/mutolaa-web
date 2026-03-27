import type { Locale } from "@/i18n/config";
import type {
  BookDetailExtended,
  CatalogBook,
  Genre,
} from "@/lib/catalog";

/**
 * Paginated catalog list (`count`, `next`, `results`); same item shape as other book list APIs.
 * @see https://api.mutolaa.com/api/v1/book/BookList/
 */
const WEB_BOOKS_LIST_PATH = "/api/v1/book/BookList/";

/** Page size per request (`limit` query). Clamped 25–500. */
function getMutolaaBooksPageSize(): number {
  const n = Number(process.env.MUTOLAA_BOOKS_PAGE_SIZE ?? 100);
  const v = Number.isFinite(n) ? n : 100;
  return Math.min(500, Math.max(25, v));
}

/** Max paginated requests per build/cache refresh. Clamped 1–50 (default 8 ≈ 800 books at page size 100). */
function getMutolaaBooksMaxPages(): number {
  const n = Number(process.env.MUTOLAA_BOOKS_MAX_PAGES ?? 8);
  const v = Number.isFinite(n) ? n : 8;
  return Math.min(50, Math.max(1, v));
}

function buildBooksListPageUrl(offset: number, limit: number): string {
  const base = getMutolaaApiBaseUrl();
  const q = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return `${base}${WEB_BOOKS_LIST_PATH}?${q.toString()}`;
}

function resolveNextPageUrl(nextRaw: unknown): string | null {
  if (typeof nextRaw !== "string" || !nextRaw.trim()) {
    return null;
  }
  const n = nextRaw.trim();
  if (/^https?:\/\//i.test(n)) {
    return n;
  }
  if (n.startsWith("/")) {
    return `${getMutolaaApiBaseUrl()}${n}`;
  }
  return null;
}

export function getMutolaaApiBaseUrl(): string {
  const raw =
    process.env.MUTOLAA_API_URL ??
    process.env.NEXT_PUBLIC_MUTOLAA_API_URL ??
    "https://api.mutolaa.com";
  return raw.replace(/\/$/, "");
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) {
      return v.trim();
    }
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) {
      return v;
    }
    if (typeof v === "string" && /^\d+$/.test(v)) {
      return Number(v);
    }
  }
  return undefined;
}

function pickBool(obj: Record<string, unknown>, keys: string[]): boolean {
  for (const k of keys) {
    if (obj[k] === true) {
      return true;
    }
  }
  return false;
}


/** Strip basic HTML tags for plain-text synopsis. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickLocalizedStrings(
  obj: Record<string, unknown>,
  baseKeys: string[],
  localeKeys: Record<Locale, string[]>,
): Record<Locale, string> {
  const fallback =
    pickString(obj, baseKeys) ??
    pickString(obj, localeKeys.uz) ??
    pickString(obj, localeKeys.ru) ??
    pickString(obj, localeKeys.en) ??
    "";

  const uz =
    pickString(obj, localeKeys.uz) ??
    pickString(obj, baseKeys) ??
    fallback;
  const ru =
    pickString(obj, localeKeys.ru) ??
    pickString(obj, baseKeys) ??
    uz;
  const en =
    pickString(obj, localeKeys.en) ??
    pickString(obj, baseKeys) ??
    uz;

  return { uz, ru, en };
}

function pickAuthor(obj: Record<string, unknown>): Record<Locale, string> {
  const direct = pickLocalizedStrings(
    obj,
    ["author", "author_name", "writer", "book_author"],
    {
      uz: ["author_uz", "author_name_uz"],
      ru: ["author_ru", "author_name_ru"],
      en: ["author_en", "author_name_en"],
    },
  );

  const authorsVal = obj.authors ?? obj.author_list;
  if (Array.isArray(authorsVal) && authorsVal.length > 0) {
    const names = authorsVal
      .map((a) => {
        if (typeof a === "string") {
          return a;
        }
        if (isRecord(a)) {
          return pickString(a, ["name", "full_name", "title"]);
        }
        return undefined;
      })
      .filter(Boolean) as string[];
    if (names.length) {
      const joined = names.join(", ");
      return {
        uz: joined,
        ru: joined,
        en: joined,
      };
    }
  }

  if (isRecord(authorsVal)) {
    const n = pickString(authorsVal, ["name", "full_name"]);
    if (n) {
      return { uz: n, ru: n, en: n };
    }
  }

  return direct;
}

function inferGenre(raw: unknown): Genre {
  const s = String(raw ?? "")
    .toLowerCase()
    .normalize("NFKD");
  if (
    /drama|teatr|dramatur|пьес|драм/.test(s)
  ) {
    return "drama";
  }
  if (
    /poetr|poetry|sher|she'r|поэз|стих/.test(s)
  ) {
    return "poetry";
  }
  if (
    /folk|doston|ertak|эпос|сказ|фольклор|folklor/.test(s)
  ) {
    return "folklore";
  }
  if (
    /essay|hikoya|qissa|повест|рассказ|эссе|essay/.test(s)
  ) {
    return "essays";
  }
  return "novel";
}

function pickGenre(obj: Record<string, unknown>): Genre {
  const g =
    pickString(obj, [
      "genre",
      "genre_name",
      "category",
      "category_name",
      "type",
      "book_type",
    ]) ?? "";
  const id = pickNumber(obj, ["genre_id", "category_id"]);
  const combined = `${g} ${id ?? ""}`;
  return inferGenre(combined);
}

/** BookDetail API exposes `categories: { title }[]` (e.g. Hikoya, Oʻzbek adabiyoti). */
function pickGenreFromCategories(obj: Record<string, unknown>): Genre {
  const cats = obj.categories;
  if (!Array.isArray(cats) || cats.length === 0) {
    return pickGenre(obj);
  }
  const titles: string[] = [];
  for (const c of cats) {
    if (isRecord(c)) {
      const t = pickString(c, ["title", "name"]);
      if (t) {
        titles.push(t);
      }
    }
  }
  if (!titles.length) {
    return pickGenre(obj);
  }
  return inferGenre(titles.join(" "));
}

function pickYear(obj: Record<string, unknown>): number {
  const y =
    pickNumber(obj, [
      "year",
      "publish_year",
      "published_year",
      "release_year",
    ]) ?? 0;
  if (y > 0) {
    return y;
  }
  const iso = pickString(obj, ["published_at", "created_at", "updated_at"]);
  if (iso) {
    const d = Date.parse(iso);
    if (!Number.isNaN(d)) {
      return new Date(d).getFullYear();
    }
  }
  return 0;
}

function sanitizeMediaUrlString(url: string): string {
  return url.trim().replace(/^["']+|["']+$/g, "");
}

/** Merge common nested API wrappers so cover/title fields surface at top level. */
function expandRecord(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...raw };
  for (const key of [
    "book",
    "data",
    "attributes",
    "item",
    "model",
    "payload",
    "result",
  ]) {
    const inner = raw[key];
    if (!isRecord(inner)) {
      continue;
    }
    for (const [ik, iv] of Object.entries(inner)) {
      const cur = out[ik];
      const empty =
        cur === undefined || cur === null || cur === "" || cur === false;
      if (empty) {
        out[ik] = iv;
      }
    }
  }
  return out;
}

function nestedUrl(
  obj: Record<string, unknown>,
  path: string[],
): string | undefined {
  let cur: unknown = obj;
  for (const p of path) {
    if (!isRecord(cur)) {
      return undefined;
    }
    cur = cur[p];
  }
  return typeof cur === "string" && cur.trim()
    ? sanitizeMediaUrlString(cur)
    : undefined;
}

function firstUrlFromMediaList(arr: unknown): string | undefined {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined;
  }
  const coverLike = arr.find((el) => {
    if (!isRecord(el)) {
      return false;
    }
    const c = String(
      el.collection_name ?? el.collection ?? el.type ?? el.role ?? "",
    ).toLowerCase();
    return (
      c === "cover" ||
      c === "covers" ||
      c === "book_cover" ||
      c === "thumbnail"
    );
  });
  if (isRecord(coverLike)) {
    const u = pickString(coverLike, [
      "url",
      "src",
      "path",
      "original_url",
      "full_url",
      "preview_url",
      "thumbnail_url",
    ]);
    if (u) {
      return sanitizeMediaUrlString(u);
    }
  }
  for (const el of arr) {
    if (typeof el === "string" && el.trim()) {
      const s = sanitizeMediaUrlString(el);
      if (/^https?:\/\//i.test(s) || s.startsWith("/")) {
        return s;
      }
    }
    if (isRecord(el)) {
      const u = pickString(el, [
        "url",
        "src",
        "path",
        "original_url",
        "full_url",
        "preview_url",
        "thumbnail_url",
        "large",
        "medium",
        "small",
        "webp",
        "file_url",
        "public_url",
      ]);
      if (u) {
        return sanitizeMediaUrlString(u);
      }
    }
  }
  return undefined;
}

function pickCoverUrl(obj: Record<string, unknown>): string | undefined {
  const directKeys = [
    "cover",
    "cover_url",
    "coverUrl",
    "cover_image",
    "cover_image_url",
    "coverImage",
    "cover_path",
    "book_cover",
    "book_cover_url",
    "bookCover",
    "bookCoverUrl",
    "ebook_cover",
    "e_book_cover",
    "image",
    "image_url",
    "imageUrl",
    "image_path",
    "main_image",
    "main_image_url",
    "thumbnail",
    "thumbnail_url",
    "thumb",
    "thumb_url",
    "preview",
    "preview_url",
    "poster",
    "photo",
    "photo_url",
    "picture",
    "banner",
    "file_url",
    "url_cover",
    "default_cover",
    "front_cover",
  ];
  const direct = pickString(obj, directKeys);
  if (direct) {
    return absolutizeMediaUrl(sanitizeMediaUrlString(direct));
  }

  const deepPaths: string[][] = [
    ["cover", "url"],
    ["cover", "src"],
    ["cover", "path"],
    ["cover", "image", "url"],
    ["cover", "data", "attributes", "url"],
    ["cover", "data", "url"],
    ["image", "url"],
    ["image", "src"],
    ["image", "data", "attributes", "url"],
    ["photo", "url"],
    ["picture", "url"],
    ["file", "url"],
    ["storage", "url"],
    ["media", "url"],
  ];
  for (const path of deepPaths) {
    const u = nestedUrl(obj, path);
    if (u) {
      return absolutizeMediaUrl(u);
    }
  }

  const nested = obj.cover ?? obj.image ?? obj.photo ?? obj.picture;
  if (isRecord(nested)) {
    const url = pickString(nested, [
      "url",
      "src",
      "path",
      "original",
      "original_url",
      "full_url",
      "large",
      "medium",
      "webp",
    ]);
    if (url) {
      return absolutizeMediaUrl(sanitizeMediaUrlString(url));
    }
  }

  for (const listKey of [
    "media",
    "images",
    "photos",
    "gallery",
    "files",
    "attachments",
    "covers",
  ]) {
    const u = firstUrlFromMediaList(obj[listKey]);
    if (u) {
      return absolutizeMediaUrl(u);
    }
  }

  return undefined;
}

function absolutizeMediaUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${getMutolaaApiBaseUrl()}${url}`;
  }
  return `${getMutolaaApiBaseUrl()}/${url.replace(/^\//, "")}`;
}

function slugifyBase(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF\u0600-\u06FF]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function pickSlug(obj: Record<string, unknown>, fallbackId: string): string {
  const raw =
    pickString(obj, [
      "slug",
      "book_slug",
      "url_slug",
      "seo_slug",
      "alias",
    ]) ?? "";
  const fromSlug = raw ? slugifyBase(raw) : "";
  if (fromSlug) {
    return fromSlug;
  }
  const title = pickString(obj, ["title", "name", "book_title"]) ?? "";
  const fromTitle = title ? slugifyBase(title) : "";
  if (fromTitle) {
    return fromTitle;
  }
  return `book-${slugifyBase(fallbackId) || "id"}`;
}

function pickSynopsis(obj: Record<string, unknown>): Record<Locale, string> {
  const descKeys = [
    "description",
    "body",
    "content",
    "summary",
    "excerpt",
    "annotation",
    "about",
    "synopsis",
  ];
  const uzHtml =
    pickString(obj, ["description_uz", "body_uz", "content_uz"]) ??
    pickString(obj, descKeys);
  const ruHtml =
    pickString(obj, ["description_ru", "body_ru", "content_ru"]) ?? uzHtml;
  const enHtml =
    pickString(obj, ["description_en", "body_en", "content_en"]) ?? uzHtml;

  const clean = (s: string | undefined) =>
    s ? stripHtml(s) : "";

  return {
    uz: clean(uzHtml) || clean(pickString(obj, descKeys)) || "",
    ru: clean(ruHtml) || clean(uzHtml) || "",
    en: clean(enHtml) || clean(uzHtml) || "",
  };
}

function unwrapBooksArray(json: unknown): unknown[] {
  if (Array.isArray(json)) {
    return json;
  }
  if (isRecord(json)) {
    for (const k of ["data", "results", "books", "items", "content", "payload"]) {
      const v = json[k];
      if (Array.isArray(v)) {
        return v;
      }
      if (isRecord(v) && Array.isArray(v.items)) {
        return v.items;
      }
      if (isRecord(v) && Array.isArray(v.data)) {
        return v.data;
      }
    }
  }
  return [];
}

/** One page from a DRF-style `{ results, next }` list or a bare array. */
function parseBooksListResponse(json: unknown): {
  rows: unknown[];
  nextUrl: string | null;
} {
  if (Array.isArray(json)) {
    return { rows: json, nextUrl: null };
  }
  if (isRecord(json) && Array.isArray(json.results)) {
    return {
      rows: json.results,
      nextUrl: resolveNextPageUrl(json.next),
    };
  }
  return { rows: unwrapBooksArray(json), nextUrl: null };
}

function normalizeItem(
  raw: unknown,
  index: number,
  usedSlugs: Set<string>,
): CatalogBook | null {
  if (!isRecord(raw)) {
    return null;
  }

  const row = expandRecord(raw);

  const id =
    pickString(row, ["id", "pk", "book_id", "uuid"]) ??
    String(pickNumber(row, ["id", "pk", "book_id"]) ?? index);

  const title = pickLocalizedStrings(
    row,
    ["title", "name", "book_title"],
    {
      uz: ["title_uz", "name_uz"],
      ru: ["title_ru", "name_ru"],
      en: ["title_en", "name_en"],
    },
  );

  let slug = pickSlug(row, id);
  if (usedSlugs.has(slug)) {
    slug = `${slug}-${id}`.slice(0, 120);
  }
  usedSlugs.add(slug);

  const author = pickAuthor(row);
  const synopsis = pickSynopsis(row);
  const genre = pickGenre(row);
  const year = pickYear(row);
  const coverUrl = pickCoverUrl(row);

  const hasTitle = title.uz || title.ru || title.en;
  if (!hasTitle) {
    return null;
  }

  return {
    slug,
    genre,
    year,
    title,
    author,
    synopsis,
    coverUrl: coverUrl ?? null,
  };
}

/**
 * Fetches the public web book list from Mutolaa API (paginated).
 *
 * Env (optional):
 * - `MUTOLAA_API_URL` / `NEXT_PUBLIC_MUTOLAA_API_URL` — API origin (default https://api.mutolaa.com)
 * - `MUTOLAA_BOOKS_PAGE_SIZE` — `limit` per page, default 100, max 500
 * - `MUTOLAA_BOOKS_MAX_PAGES` — max pages to follow via `next`, default 8, max 50
 *
 * @see https://api.mutolaa.com/api/v1/book/BookList/
 */
export async function fetchMutolaaWebBooks(): Promise<CatalogBook[]> {
  const pageSize = getMutolaaBooksPageSize();
  const maxPages = getMutolaaBooksMaxPages();

  const usedSlugs = new Set<string>();
  const out: CatalogBook[] = [];
  let nextUrl: string | null = buildBooksListPageUrl(0, pageSize);
  let pages = 0;

  while (nextUrl !== null && pages < maxPages) {
    const res = await fetch(nextUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Mutolaa book API ${res.status}: ${nextUrl}`);
    }

    const json: unknown = await res.json();
    const { rows, nextUrl: following } = parseBooksListResponse(json);

    for (let i = 0; i < rows.length; i++) {
      const book = normalizeItem(rows[i], out.length + i, usedSlugs);
      if (book) {
        out.push(book);
      }
    }

    pages += 1;
    nextUrl = following;
  }

  return out;
}

/** Single book for web (slug in path). @see https://api.mutolaa.com/api/v1/book/web/BookDetail/ */
const WEB_BOOK_DETAIL_PATH = "/api/v1/book/web/BookDetail/";

export async function fetchMutolaaBookDetail(slug: string): Promise<unknown> {
  const base = getMutolaaApiBaseUrl();
  const path = `${WEB_BOOK_DETAIL_PATH}${encodeURIComponent(slug)}/`;
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Mutolaa book detail ${res.status}: ${url}`);
  }
  return res.json();
}

/**
 * BookDetail JSON → sahifa + `has_ebook` / fragmentlar.
 * EPUB fayl URL odatda ochiq JSONda kelmaydi; `ebook_fragment` ba’zan matn/HTML havolasi bo‘lishi mumkin.
 */
export function normalizeBookDetailToLocalized(
  json: unknown,
  locale: Locale,
): BookDetailExtended | null {
  if (!isRecord(json)) {
    return null;
  }

  const row = expandRecord(json);

  const id =
    pickString(row, ["id", "pk", "book_id", "uuid"]) ??
    String(pickNumber(row, ["id", "pk", "book_id"]) ?? "");

  const title =
    pickString(row, ["title", "name", "book_title"]) ?? "";
  if (!title.trim()) {
    return null;
  }

  const slug = pickSlug(row, id);
  const authorRec = pickAuthor(row);
  const author =
    authorRec[locale] || authorRec.uz || authorRec.ru || authorRec.en || "";

  const rawDesc =
    pickString(row, [
      "description",
      "synopsis",
      "body",
      "content",
      "summary",
      "annotation",
      "about",
    ]) ?? "";
  const synopsis = rawDesc ? stripHtml(rawDesc) : "";

  const coverUrl = pickCoverUrl(row) ?? null;
  const genre = pickGenreFromCategories(row);
  const year = pickYear(row);

  const hasEbook = pickBool(row, ["has_ebook", "hasEbook"]);
  const hasAudiobook = pickBool(row, ["has_audiobook", "hasAudiobook"]);

  const rawEbookFrag = pickString(row, [
    "ebook_fragment",
    "ebook_fragment_url",
    "ebook_url",
    "epub_url",
  ]);
  const ebookFragmentUrl =
    rawEbookFrag && /^https?:\/\//i.test(rawEbookFrag.trim())
      ? absolutizeMediaUrl(sanitizeMediaUrlString(rawEbookFrag))
      : null;

  const rawAudioFrag = pickString(row, [
    "audiobook_fragment",
    "audiobook_url",
    "audio_url",
  ]);
  const audiobookFragmentUrl =
    rawAudioFrag && /^https?:\/\//i.test(rawAudioFrag.trim())
      ? absolutizeMediaUrl(sanitizeMediaUrlString(rawAudioFrag))
      : null;

  return {
    slug,
    genre,
    year,
    title,
    author,
    synopsis,
    coverUrl,
    hasEbook,
    hasAudiobook,
    ebookFragmentUrl,
    audiobookFragmentUrl,
  };
}
