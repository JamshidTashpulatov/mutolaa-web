import type { Locale } from "./config";
import type { Dictionary } from "./types";
import en from "./dictionaries/en";
import ru from "./dictionaries/ru";
import uz from "./dictionaries/uz";

const map: Record<Locale, Dictionary> = {
  uz,
  ru,
  en,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return map[locale];
}
