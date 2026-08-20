"use client";
import Link from "next/link";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { assetUrl } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money, productName } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { useState } from "react";
import { useLocale } from "@/context/locale-context";

export function ProductCard({ product }: { product: Product }) {
  const { dictionary: d } = useLocale();
  const { addToCart } = useStore();
  const [note, setNote] = useState("");
  const discounted =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);
  async function add() {
    try {
      await addToCart(product.id);
      setNote(d.shop.added);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Try again");
    }
  }
  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/product/${product.id}`}>
          <img
            src={assetUrl(product.image || product.images?.[0])}
            alt={productName(product)}
          />
        </Link>
        {discounted && <span className="badge">{d.shop.sale}</span>}
        <button className="heart" aria-label={d.shop.save}>
          <HeartIcon />
        </button>
        <button onClick={add} className="quick-add">
          <ShoppingBagIcon />
          {note || d.shop.quickAdd}
        </button>
      </div>
      <Link href={`/product/${product.id}`} className="product-info">
        <div>
          <h3>{productName(product)}</h3>
          {product.rate !== undefined && (
            <span className="rating">★ {Number(product.rate).toFixed(1)}</span>
          )}
        </div>
        <p>
          {discounted && <del>{money(product.price)}</del>}{" "}
          {money(product.discount_price || product.price)}
        </p>
      </Link>
    </article>
  );
}
