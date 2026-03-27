import type { Locale } from "@/i18n/config";

export type Genre = "novel" | "poetry" | "drama" | "essays" | "folklore";

export const GENRES: Genre[] = [
  "novel",
  "poetry",
  "drama",
  "essays",
  "folklore",
];

export type GenreFilter = "all" | Genre;

export function parseGenreParam(value: string | null): GenreFilter {
  if (!value || value === "all") {
    return "all";
  }
  if (GENRES.includes(value as Genre)) {
    return value as Genre;
  }
  return "all";
}

export type CatalogBook = {
  slug: string;
  genre: Genre;
  year: number;
  title: Record<Locale, string>;
  author: Record<Locale, string>;
  synopsis: Record<Locale, string>;
  /** Absolute URL from API when available */
  coverUrl?: string | null;
};

export type CatalogReview = {
  quote: Record<Locale, string>;
  attribution: Record<Locale, string>;
};

/** Stable placeholder when `coverUrl` is missing (e.g. offline API → static `BOOKS`). */
export function catalogPlaceholderCoverUrl(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/400/600`;
}

export const BOOKS: CatalogBook[] = [
  {
    slug: "otgan-kunlar",
    genre: "novel",
    year: 1922,
    coverUrl: catalogPlaceholderCoverUrl("otgan-kunlar"),
    title: {
      uz: "O‘tgan kunlar",
      ru: "Прошлые дни",
      en: "Days Gone By",
    },
    author: {
      uz: "Abdulla Qodiriy",
      ru: "Абдулла Кадыри",
      en: "Abdulla Qodiriy",
    },
    synopsis: {
      uz: "O‘zbek adabiyotining yorqin klassik romani — sevgi, sadoqat va zamon talashi haqida.",
      ru: "Яркий классический роман узбекской литературы — о любви, верности и дыхании эпохи.",
      en: "A luminous classic of Uzbek fiction—love, loyalty, and the pull of changing times.",
    },
  },
  {
    slug: "kecha-va-kunduz",
    genre: "poetry",
    coverUrl: catalogPlaceholderCoverUrl("kecha-va-kunduz"),
    year: 1924,
    title: {
      uz: "Kecha va kunduz",
      ru: "Ночь и день",
      en: "Night and Day",
    },
    author: {
      uz: "Cho‘lpon",
      ru: "Чулпон",
      en: "Cho‘lpon",
    },
    synopsis: {
      uz: "Yangi badiiy uslub va she’riy tafakkurning uyg‘unligi bilan ajralib turadi.",
      ru: "Выделяется гармонией нового художественного стиля и поэтического мышления.",
      en: "Stands out for the harmony of a fresh literary voice and poetic vision.",
    },
  },
  {
    slug: "mehrobdan-chayon",
    genre: "drama",
    coverUrl: catalogPlaceholderCoverUrl("mehrobdan-chayon"),
    year: 1915,
    title: {
      uz: "Mehrobdan chayon",
      ru: "Змея из ниши",
      en: "The Snake in the Niche",
    },
    author: {
      uz: "Abdulla Avloniy (Fitrat)",
      ru: "Абдулла Авлоний (Фитрат)",
      en: "Abdulla Avloniy (Fitrat)",
    },
    synopsis: {
      uz: "Zamonaviy drama — an’analar va yangilanish o‘rtasidagi ziddiyat.",
      ru: "Современная для своего времени драма — напряжение между традицией и обновлением.",
      en: "A drama of its era—tension between tradition and renewal.",
    },
  },
  {
    slug: "sadda",
    genre: "poetry",
    coverUrl: catalogPlaceholderCoverUrl("sadda"),
    year: 1910,
    title: {
      uz: "Sadda",
      ru: "Эхо",
      en: "Echo",
    },
    author: {
      uz: "Cho‘lpon",
      ru: "Чулпон",
      en: "Cho‘lpon",
    },
    synopsis: {
      uz: "She’riy to‘plam — tabiat tasviri va insoniy tuyg‘ularning singishi.",
      ru: "Поэтический сборник — переплетение пейзажа и человеческих переживаний.",
      en: "A poetry collection where landscape and feeling meet.",
    },
  },
  {
    slug: "bolalik",
    genre: "essays",
    coverUrl: catalogPlaceholderCoverUrl("bolalik"),
    year: 1936,
    title: {
      uz: "Bolalik",
      ru: "Детство",
      en: "Childhood",
    },
    author: {
      uz: "G‘afur G‘ulom",
      ru: "Гафур Гулям",
      en: "Gʻafur Gʻulom",
    },
    synopsis: {
      uz: "Hikoya — bolalik xotiralari va sodda, samimiy til bilan.",
      ru: "Рассказ — детские воспоминания в простой, искренней манере.",
      en: "Stories of childhood told in a plain, sincere voice.",
    },
  },
  {
    slug: "alpomish",
    genre: "folklore",
    coverUrl: catalogPlaceholderCoverUrl("alpomish"),
    year: 0,
    title: {
      uz: "Alpomish",
      ru: "Алпамыш",
      en: "Alpamysh",
    },
    author: {
      uz: "Xalq dostoni",
      ru: "Народный дастан",
      en: "Folk epic",
    },
    synopsis: {
      uz: "O‘zbek xalq dostoni — qahramonlik, aql-u zakovat va insonparvarlik qo‘shig‘i.",
      ru: "Узбекский народный дастан — о подвиге, остроумии и человечности.",
      en: "An Uzbek oral epic—courage, wit, and humanity.",
    },
  },
];

export const BOOK_REVIEWS: Record<string, CatalogReview[]> = {
  "otgan-kunlar": [
    {
      quote: {
        uz: "Asarning til boyligi va tasvirlarining ravonligi mutolaani yoqimli qiladi.",
        ru: "Богатство языка и ясность образов делают чтение особенно приятным.",
        en: "The language and imagery make the reading deeply satisfying.",
      },
      attribution: {
        uz: "Tanlangan mutolaachi",
        ru: "Читатель",
        en: "Reader",
      },
    },
    {
      quote: {
        uz: "Qahramonlar psixologiyasi bugungi kunga qadar yangi o‘quvchini jalb etadi.",
        ru: "Психология героев до сих пор увлекает нового читателя.",
        en: "The psychology of the characters still draws readers in.",
      },
      attribution: {
        uz: "Adabiyot o‘qituvchisi",
        ru: "Преподаватель литературы",
        en: "Literature teacher",
      },
    },
  ],
  "kecha-va-kunduz": [
    {
      quote: {
        uz: "Har bir she’r alohida ohangda o‘qiladi, lekin butunlik silliqligi saqlanadi.",
        ru: "Каждое стихотворение звучит своим тоном, но целостность сохраняется.",
        en: "Each poem has its own tone, yet the collection holds together.",
      },
      attribution: {
        uz: "She’riyat tadqiqotchisi",
        ru: "Исследователь поэзии",
        en: "Poetry scholar",
      },
    },
  ],
  "mehrobdan-chayon": [
    {
      quote: {
        uz: "Sahna dramaturgiyasi ziddiyatni aniq va tasirli beradi.",
        ru: "Драматургия сцены ясно и убедительно передаёт конфликт.",
        en: "The staging of conflict feels clear and compelling.",
      },
      attribution: {
        uz: "Teatr tanqidchisi",
        ru: "Театральный критик",
        en: "Theatre critic",
      },
    },
  ],
};

export function getBookBySlug(slug: string): CatalogBook | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function localizeBook(book: CatalogBook, locale: Locale) {
  return {
    slug: book.slug,
    genre: book.genre,
    year: book.year,
    title: book.title[locale],
    author: book.author[locale],
    synopsis: book.synopsis[locale],
    coverUrl: book.coverUrl ?? null,
  };
}

export type LocalizedBook = ReturnType<typeof localizeBook>;

/** Kitob sahifasi: API `has_ebook` / fragmentlar; EPUB URL ochiq maydonda kelmaydi. */
export type BookDetailExtended = LocalizedBook & {
  hasEbook: boolean;
  hasAudiobook: boolean;
  ebookFragmentUrl: string | null;
  audiobookFragmentUrl: string | null;
};

export function localizeBookToDetailExtended(
  book: CatalogBook,
  locale: Locale,
): BookDetailExtended {
  const b = localizeBook(book, locale);
  return {
    ...b,
    /* Static catalog: allow reader; EPUB URL comes from API when live, else /public fallback */
    hasEbook: true,
    hasAudiobook: false,
    ebookFragmentUrl: null,
    audiobookFragmentUrl: null,
  };
}

export function getLocalizedReviews(slug: string, locale: Locale) {
  const list = BOOK_REVIEWS[slug] ?? [];
  return list.map((r) => ({
    quote: r.quote[locale],
    attribution: r.attribution[locale],
  }));
}
