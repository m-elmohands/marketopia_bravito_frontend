import en from "./locales/en.json";
import ar from "./locales/ar.json";
import type { Locale } from "./config";

export const dictionaries = { en, ar } satisfies Record<Locale, typeof en>;
export type Dictionary = (typeof dictionaries)[Locale];
