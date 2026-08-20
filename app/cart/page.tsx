"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LockClosedIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useStore } from "@/context/store-context";
import { api, assetUrl } from "@/lib/api";
import { money, productName } from "@/lib/utils";
import { useLocale } from "@/context/locale-context";

export default function Cart() {
  const { cart, token, refreshCart, loading } = useStore();
  const { dictionary: d } = useLocale();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function update(id: number, quantity: number) {
    if (quantity < 1) return remove(id);
    setPendingId(id);
    setError("");
    try {
      await api(
        `/carts/${id}`,
        { method: "PUT", body: JSON.stringify({ quantity }) },
        token,
      );
      await refreshCart();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update bag.",
      );
    } finally {
      setPendingId(null);
    }
  }

  async function remove(id: number) {
    setPendingId(id);
    setError("");
    try {
      await api(`/carts/${id}`, { method: "DELETE" }, token);
      await refreshCart();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not remove item.",
      );
    } finally {
      setPendingId(null);
    }
  }

  if (loading)
    return (
      <div className="cart-status-page">
        <div className="cart-loader" />
        <span>{d.cart.preparing}</span>
      </div>
    );
  if (!token)
    return (
      <CartEmpty
        eyebrow={d.cart.remembered}
        title={d.cart.signInTitle}
        copy={d.cart.signInCopy}
        href="/login?next=/cart"
        action={d.cart.signInAction}
      />
    );
  if (!cart?.items.length)
    return (
      <CartEmpty
        eyebrow={d.cart.emptyEyebrow}
        title={d.cart.emptyTitle}
        copy={d.cart.emptyCopy}
        href="/shop"
        action={d.cart.explore}
      />
    );

  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  return (
    <div className="cart-page">
      <div className="cart-progress" aria-label="Checkout progress">
        <div className="active">
          <span>1</span>
          <p>{d.cart.stepBag}</p>
        </div>
        <i />
        <div>
          <span>2</span>
          <p>{d.cart.stepDetails}</p>
        </div>
        <i />
        <div>
          <span>3</span>
          <p>{d.cart.stepComplete}</p>
        </div>
      </div>
      <header className="cart-heading">
        <div>
          <span className="eyebrow">{d.cart.selection}</span>
          <h1>{d.cart.title}</h1>
        </div>
        <p>
          {itemCount} {itemCount === 1 ? d.cart.piece : d.cart.pieces},{" "}
          {d.cart.chosen}
        </p>
      </header>
      {error && <div className="cart-error">{error}</div>}
      <div className="cart-layout">
        <section className="cart-items" aria-label="Items in your bag">
          <div className="cart-list-labels">
            <span>{d.cart.product}</span>
            <span>{d.common.quantity}</span>
            <span>{d.common.total}</span>
          </div>
          {cart.items.map((item) => {
            const price = Number(
              item.product.discount_price || item.product.price,
            );
            const isPending = pendingId === item.id;
            const options = item.product_attribute_values
              ?.map((value) => value.attribute_value?.value)
              .filter(Boolean)
              .join(" · ");
            return (
              <article
                className={`cart-item ${isPending ? "is-pending" : ""}`}
                key={item.id}
              >
                <Link
                  className="cart-item-image"
                  href={`/product/${item.product.id}`}
                >
                  <img
                    src={assetUrl(item.product.image)}
                    alt={productName(item.product)}
                  />
                </Link>
                <div className="cart-item-copy">
                  <span className="cart-item-kicker">{d.cart.collection}</span>
                  <Link href={`/product/${item.product.id}`}>
                    {productName(item.product)}
                  </Link>
                  {options && <p>{options}</p>}
                  <strong>{money(price)}</strong>
                  <button className="remove" onClick={() => remove(item.id)}>
                    <TrashIcon /> {d.common.remove}
                  </button>
                </div>
                <div className="cart-item-quantity">
                  <span className="mobile-cart-label">{d.common.quantity}</span>
                  <div className="quantity">
                    <button
                      disabled={isPending}
                      onClick={() => update(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      disabled={isPending}
                      onClick={() => update(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <span className="mobile-cart-label">{d.common.total}</span>
                  <strong>{money(price * item.quantity)}</strong>
                </div>
              </article>
            );
          })}
          <div className="cart-after-list">
            <Link href="/shop">
              <ArrowLeftIcon /> {d.common.continueShopping}
            </Link>
            <span>{d.cart.taxes}</span>
          </div>
        </section>
        <aside className="cart-summary">
          <div className="summary-title">
            <div>
              <span className="eyebrow">{d.cart.details}</span>
              <h2>{d.cart.summary}</h2>
            </div>
            <ShoppingBagIcon />
          </div>
          <div className="summary-row">
            <span>{d.common.subtotal}</span>
            <b>{money(cart.pricing.total_price)}</b>
          </div>
          {cart.pricing.discount > 0 && (
            <div className="summary-row saving">
              <span>{d.cart.savings}</span>
              <b>−{money(cart.pricing.discount)}</b>
            </div>
          )}
          <div className="summary-row">
            <span>{d.common.delivery}</span>
            <small>{d.cart.calculated}</small>
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>
              {d.common.total} <small>EGP</small>
            </span>
            <b>{money(cart.pricing.total_price_after_discount)}</b>
          </div>
          <Link className="button cart-checkout-button" href="/checkout">
            {d.common.checkout} <ArrowRightIcon />
          </Link>
          <div className="summary-promise">
            <LockClosedIcon />
            <span>
              <b>{d.cart.secure}</b>
              {d.cart.protected}
            </span>
          </div>
        </aside>
      </div>
      <div className="cart-benefits">
        <div>
          <TruckIcon />
          <span>
            <b>{d.cart.clearDelivery}</b>
            {d.cart.deliveryCopy}
          </span>
        </div>
        <div>
          <ShieldCheckIcon />
          <span>
            <b>{d.cart.support}</b>
            {d.cart.supportCopy}
          </span>
        </div>
        <div>
          <CheckIcon />
          <span>
            <b>{d.cart.chosenCare}</b>
            {d.cart.chosenCopy}
          </span>
        </div>
      </div>
    </div>
  );
}

function CartEmpty({
  eyebrow,
  title,
  copy,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  href: string;
  action: string;
}) {
  return (
    <div className="cart-empty-page">
      <div className="cart-empty-mark">
        <ShoppingBagIcon />
        <span>0</span>
      </div>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      <Link className="button" href={href}>
        {action} <ArrowRightIcon />
      </Link>
    </div>
  );
}
