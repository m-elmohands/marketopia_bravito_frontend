export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookie = "bravito_locale";
export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && locales.includes(value as Locale);
