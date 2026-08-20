import { ShopContent } from "@/components/shop-content";
import { api } from "@/lib/api";
import type { Category, Pagination, Product } from "@/lib/types";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
import { Suspense } from "react";

export const metadata = { title: "Shop" };
export default async function Shop() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  let products: Pagination<Product> | Product[] = [];
  let categories: Category[] = [];
  try {
    [products, categories] = await Promise.all([
      api<Pagination<Product> | Product[]>("/products?per_page=24", {}, null, locale),
      api<Category[]>("/categories/parent", {}, null, locale),
    ]);
  } catch {}
  return (
    <Suspense fallback={null}>
      <ShopContent
        initialProducts={products}
        categories={categories}
        dictionary={d}
        locale={locale}
      />
    </Suspense>
  );
}
