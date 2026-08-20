import type { Product } from "./types";
export const productName = (p: Product) =>
  p.name || p.name_en || p.name_ar || "Untitled product";
export const money = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
export function asArray<T>(value: T[] | { data: T[] } | null | undefined): T[] {
  return Array.isArray(value) ? value : value?.data || [];
}
