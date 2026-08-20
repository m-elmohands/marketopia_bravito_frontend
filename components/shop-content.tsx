"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Category, Pagination, Product } from "@/lib/types";
import { asArray } from "@/lib/utils";

type ShopContentProps = {
  initialProducts: Pagination<Product> | Product[];
  categories: Category[];
  dictionary: Dictionary;
  locale: Locale;
};

export function ShopContent({
  initialProducts,
  categories,
  dictionary: d,
  locale,
}: ShopContentProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const controller = new AbortController();
    const path = category
      ? `/products/category/${category}?per_page=24`
      : `/products?per_page=24&search=${encodeURIComponent(search)}`;

    api<Pagination<Product> | Product[]>(
      path,
      { signal: controller.signal },
      null,
      locale,
    )
      .then(setProducts)
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") setProducts([]);
      });

    return () => controller.abort();
  }, [category, locale, search]);

  const items = asArray(products);
  return (
    <div className="page-shell shop-page">
      <div className="page-intro">
        <span className="eyebrow">{d.shop.eyebrow}</span>
        <h1>{d.shop.title}</h1>
        <p>{d.shop.copy}</p>
      </div>
      <div className="shop-toolbar">
        <div className="chips">
          <Link className={!category ? "active" : ""} href="/shop">
            {d.shop.all}
          </Link>
          {asArray(categories).map((c) => (
            <Link
              className={category === String(c.id) ? "active" : ""}
              key={c.id}
              href={`/shop?category=${c.id}`}
            >
              {c.name || c.name_en || c.name_ar}
            </Link>
          ))}
        </div>
        <span>{items.length} {d.shop.pieces}</span>
      </div>
      {search && <p className="search-result">{d.shop.results} “{search}”</p>}
      <div className="product-grid">
        {items.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {!items.length && (
        <div className="empty-state">
          <h2>{d.shop.empty}</h2>
          <p>{d.shop.emptyCopy}</p>
          <Link className="button" href="/shop">{d.shop.seeEverything}</Link>
        </div>
      )}
    </div>
  );
}
