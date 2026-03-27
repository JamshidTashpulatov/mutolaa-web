export const THEME_STORAGE_KEY = "mutolaa-theme";

export type ThemePreference = "light" | "dark";

export function readStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark") {
      return v;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function documentIsDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function applyTheme(preference: ThemePreference): void {
  document.documentElement.classList.toggle("dark", preference === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}
