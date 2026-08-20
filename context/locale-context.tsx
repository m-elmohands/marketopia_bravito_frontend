"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  type Locale,
} from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  useEffect(() => {
    const saved = localStorage.getItem(localeCookie);
    if (isLocale(saved)) setLocaleState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(localeCookie, locale);
  }, [locale]);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(localeCookie, next);
    router.refresh();
  };
  const value = useMemo(
    () => ({
      locale,
      direction: locale === "ar" ? ("rtl" as const) : ("ltr" as const),
      dictionary: dictionaries[locale],
      setLocale,
    }),
    [locale],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be inside LocaleProvider");
  return value;
}
