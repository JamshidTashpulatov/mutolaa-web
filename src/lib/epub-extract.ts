import { padReaderPagesForFlip } from "@/lib/book-reader-pages";

function splitTextIntoPages(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const pages: string[] = [];
  let buf = "";
  for (const w of words) {
    const next = buf ? `${buf} ${w}` : w;
    if (next.length > maxChars && buf) {
      pages.push(buf);
      buf = w;
    } else {
      buf = next;
    }
  }
  if (buf) {
    pages.push(buf);
  }
  return pages;
}

/**
 * Ketma-ket qisqa bo‘laklarni birlashtiradi — har bir flip-bet balandlikni to‘ldirishga yaqinroq bo‘ladi.
 */
function consolidatePagesForFill(
  pages: string[],
  minChars: number,
  hardMaxChars: number,
): string[] {
  const out: string[] = [];
  let buf = "";

  const pushBuf = () => {
    const t = buf.trim();
    if (t) {
      out.push(t);
    }
    buf = "";
  };

  for (const p of pages) {
    const t = p.trim();
    if (!t) {
      continue;
    }

    if (!buf) {
      buf = t;
      if (buf.length >= hardMaxChars) {
        out.push(buf);
        buf = "";
      }
      continue;
    }

    const merged = `${buf}\n\n${t}`;
    if (merged.length <= hardMaxChars && merged.length < minChars) {
      buf = merged;
      continue;
    }

    if (merged.length <= hardMaxChars) {
      out.push(merged);
      buf = "";
      continue;
    }

    /* merged juda uzun: avvalgi buf ni chiqarib, t dan boshlaymiz */
    pushBuf();
    buf = t;
    if (buf.length >= hardMaxChars) {
      out.push(buf);
      buf = "";
    }
  }

  pushBuf();
  return out;
}

/**
 * Loads an EPUB (URL must be fetchable from the browser — same-origin or CORS-enabled).
 * Returns plain-text pages for the flip reader.
 */
export async function extractEpubPages(
  absoluteEpubUrl: string,
  options?: {
    maxCharsPerPage?: number;
    /** Birlashtirilgach har bir betdagi minimum taxminiy belgilar */
    minCharsConsolidated?: number;
    /** Bir betda maksimum belgi (scrollsiz bir “yuz”ga sig‘ishi uchun cheklanadi) */
    maxCharsConsolidated?: number;
  },
): Promise<{ pages: string[]; epubCoverUrl: string | null }> {
  const ePub = (await import("epubjs")).default;
  const book = ePub(absoluteEpubUrl);
  await book.ready;

  let epubCoverUrl: string | null = null;
  try {
    epubCoverUrl = await book.coverUrl();
  } catch {
    epubCoverUrl = null;
  }

  const load = book.load.bind(book);
  /* Kattaroq shrift + katta padding: bir yuzda scroll yo‘q — matn sig‘masa keyingi bet */
  const maxChars = options?.maxCharsPerPage ?? 1400;
  const minConsolidated = options?.minCharsConsolidated ?? 400;
  const maxConsolidated = options?.maxCharsConsolidated ?? 1500;
  const combined: string[] = [];

  try {
    for (let i = 0; ; i++) {
      const section = book.spine.get(i);
      if (!section) {
        break;
      }
      if (section.linear === false) {
        continue;
      }
      try {
        const contents = await section.load(load);
        const el = contents as unknown as { textContent?: string | null };
        const raw = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
        if (raw.length < 24) {
          continue;
        }
        combined.push(...splitTextIntoPages(raw, maxChars));
      } catch {
        /* skip section */
      }
    }
  } finally {
    try {
      book.destroy();
    } catch {
      /* noop */
    }
  }

  const dense =
    combined.length > 0
      ? consolidatePagesForFill(combined, minConsolidated, maxConsolidated)
      : [];

  const pages = dense.length
    ? padReaderPagesForFlip(dense)
    : padReaderPagesForFlip(["\u2014"]);

  return { pages, epubCoverUrl };
}
