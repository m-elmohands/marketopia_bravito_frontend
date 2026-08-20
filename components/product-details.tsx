"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { assetUrl } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money, productName } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { useLocale } from "@/context/locale-context";
export function ProductDetails({ product }: { product: Product }) {
  const { dictionary: d } = useLocale();
  const images = product.images?.length ? product.images : [product.image];
  const [active, setActive] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [status, setStatus] = useState("");
  const { addToCart } = useStore();
  const final =
    Number(product.discount_price || product.price) +
    Object.values(selected).reduce((sum, id) => {
      for (const a of product.attributes || []) {
        const v = a.values.find((v) => v.product_attribute_value_id === id);
        if (v) return sum + Number(v.price || 0);
      }
      return sum;
    }, 0);
  async function add() {
    if ((product.attributes || []).length !== Object.keys(selected).length) {
      setStatus(d.product.choose);
      return;
    }
    try {
      await addToCart(product.id, qty, Object.values(selected));
      setStatus(d.product.added);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Could not add item.");
    }
  }
  return (
    <div className="page-shell product-page">
      <div className="breadcrumbs">
        <Link href="/">{d.product.home}</Link>
        <ChevronRightIcon />
        <Link href="/shop">{d.common.shop}</Link>
        <ChevronRightIcon />
        <span>{productName(product)}</span>
      </div>
      <div className="product-detail-grid">
        <div className="gallery">
          <div className="thumbs">
            {images.map((img, i) => (
              <button
                className={img === active ? "active" : ""}
                key={`${img}-${i}`}
                onClick={() => setActive(img)}
              >
                <img src={assetUrl(img)} alt="" />
              </button>
            ))}
          </div>
          <div className="main-image">
            <img src={assetUrl(active)} alt={productName(product)} />
          </div>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{d.product.find}</span>
          <h1>{productName(product)}</h1>
          <div className="price-line">
            <strong>{money(final)}</strong>
            {product.discount_price && <del>{money(product.price)}</del>}
            <span>★ {Number(product.rate || 0).toFixed(1)}</span>
          </div>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html:
                product.description ||
                "A considered everyday essential, selected for its quality, utility, and lasting character.",
            }}
          />
          {product.attributes?.map((a) => (
            <fieldset className="options" key={a.id}>
              <legend>{a.name}</legend>
              <div>
                {a.values.map((v) => (
                  <button
                    onClick={() =>
                      setSelected((s) => ({
                        ...s,
                        [a.id]: v.product_attribute_value_id,
                      }))
                    }
                    className={
                      selected[a.id] === v.product_attribute_value_id
                        ? "selected"
                        : ""
                    }
                    key={v.id}
                  >
                    {v.name}
                    {Number(v.price) > 0 && <small>+{money(v.price)}</small>}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="buy-row">
            <div className="quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <MinusIcon />
              </button>
              <span>{qty}</span>
              <button
                onClick={() =>
                  setQty(
                    Math.min(
                      product.max_order_quantity || product.quantity || 99,
                      qty + 1,
                    ),
                  )
                }
              >
                <PlusIcon />
              </button>
            </div>
            <button className="button grow" onClick={add}>
              {d.product.add} · {money(final * qty)}
            </button>
          </div>
          {status && <p className="form-status">{status}</p>}
          <div className="detail-promises">
            <p>
              <TruckIcon />
              <span>
                <b>{d.product.delivery}</b>
                {d.product.deliveryCopy}
              </span>
            </p>
            <p>
              <ShieldCheckIcon />
              <span>
                <b>{d.product.confidence}</b>
                {d.product.confidenceCopy}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
