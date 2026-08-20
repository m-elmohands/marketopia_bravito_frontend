import type { ApiResponse } from "./types";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  type Locale,
} from "@/i18n/config";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");
export const ASSET_URL = (
  process.env.NEXT_PUBLIC_ASSET_URL || API_URL.replace(/\/api$/, "")
).replace(/\/$/, "");

export function assetUrl(path?: string | null) {
  if (!path) return "/placeholder.svg";
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\//, "").replace(/^public\//, "");
  return `${ASSET_URL}/${clean.startsWith("storage/") || clean.startsWith("assets/") ? clean : `storage/${clean}`}`;
}

export async function api<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
  locale?: Locale,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const browserLocale =
    typeof window !== "undefined" ? localStorage.getItem(localeCookie) : null;
  headers.set(
    "Accept-Language",
    locale ?? (isLocale(browserLocale) ? browserLocale : defaultLocale),
  );
  if (!(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const hasNextCacheOptions = "next" in init;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    ...(!hasNextCacheOptions && !init.cache ? { cache: "no-store" as const } : {}),
  });
  const payload = await response
    .json()
    .catch(() => ({ message: "The server returned an invalid response." }));
  if (!response.ok || payload.success === false)
    throw new Error(payload.message || "Something went wrong.");
  return (payload.data ?? payload) as T;
}

export async function safeApi<T>(
  path: string,
  fallback: T,
  locale?: Locale,
): Promise<T> {
  try {
    return await api<T>(
      path,
      { next: { revalidate: 60 } } as RequestInit,
      null,
      locale,
    );
  } catch {
    return fallback;
  }
}
