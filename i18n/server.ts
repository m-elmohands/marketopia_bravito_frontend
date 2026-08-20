import "server-only";
import { defaultLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

export async function getServerLocale(): Promise<Locale> {
  // Static exports are generated at build time, where there is no visitor
  // request (and therefore no cookie) available.
  return defaultLocale;
}

export async function getServerDictionary() {
  return dictionaries[await getServerLocale()];
}
