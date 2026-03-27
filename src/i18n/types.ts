import type { MegaNavCategoryId } from "@/lib/nav-mega-categories";

export type CuratedCollectionId =
  | "overnight"
  | "goals"
  | "romance"
  | "children"
  | "comics";

export type Dictionary = {
  shell: {
    skipToContent: string;
    /** Mobil sidebar menyusi tugmasi */
    sidebarMenu: string;
    /** Mobil overlay yopish */
    closeSidebarOverlay: string;
  };
  brand: string;
  nav: {
    home: string;
    /** Sidebar layoutdagi alohida bosh sahifa (eksperiment) */
    sidebarHome: string;
    genres: string;
    shelf: string;
    library: string;
    collections: string;
    catalog: string;
    allCatalog: string;
    megaMenuHeading: string;
    megaCategories: Record<MegaNavCategoryId, string>;
  };
  header: {
    searchPlaceholder: string;
    premium: string;
    openInApp: string;
    appModalTitle: string;
    appModalBody: string;
    appStore: string;
    googlePlay: string;
    profileLabel: string;
    profileSettings: string;
    profileHistory: string;
    profileLogout: string;
    profileCollections: string;
    profileDarkMode: string;
    languageMenu: string;
  };
  libraryPage: {
    intro: string;
    openCatalog: string;
  };
  premiumPage: {
    intro: string;
  };
  footer: {
    rights: string;
    about: string;
    help: string;
    contact: string;
    collections: string;
    getApp: string;
    follow: string;
  };
  locale: {
    uz: string;
    ru: string;
    en: string;
  };
  shelf: {
    sampleRail: string;
  };
  book: {
    open: string;
    coverFallback: string;
    yearLabel: string;
    synopsis: string;
    reviewsHeading: string;
    backToCatalog: string;
    readSample: string;
    ratingLabel: string;
    readMutolaa: string;
    listen: string;
    listenUnavailable: string;
    readerClose: string;
    readerEmpty: string;
    readerPrev: string;
    readerNext: string;
    readerLoading: string;
    readerError: string;
  };
  review: {
    sectionTitle: string;
  };
  patterns: {
    books: { title: string; author: string }[];
    reviewQuote: string;
    reviewAttribution: string;
  };
  home: {
    entry: {
      headline: string;
      supporting: string;
      primaryCta: string;
      secondaryApp: string;
      featuredWorkLabel: string;
      readFeatured: string;
    };
    discovery: {
      title: string;
      subtitle: string;
    };
    shelf: {
      mostRead: string;
      newlyAdded: string;
      recommendations: string;
      audiobooks: string;
      uzbekLiterature: string;
      worldLiterature: string;
    };
    genreHubTitle: string;
    curatedHeading: string;
    curatedCollections: Record<
      CuratedCollectionId,
      { title: string; description: string }
    >;
    seeAll: string;
    details: string;
    formatAudiobook: string;
    closingNote: string;
  };
  /** Sidebar + bosh sahifa (home-sidebar) maket varianti */
  homeV2: {
    searchPlaceholder: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    allBooksTitle: string;
    shelfStarter: string;
    shelfShortestAudio: string;
    seeAll: string;
    sidebar: {
      home: string;
      collections: string;
      audiobooks: string;
      fiction: string;
      science: string;
      about: string;
      help: string;
      languagePrefix: string;
    };
    auth: {
      login: string;
      register: string;
    };
    collapse: string;
    expand: string;
  };
  catalog: {
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    genreLabel: string;
    genres: {
      all: string;
      novel: string;
      poetry: string;
      drama: string;
      essays: string;
      folklore: string;
    };
    empty: string;
    resultsLine: string;
  };
  breadcrumbs: {
    home: string;
    catalog: string;
  };
};
