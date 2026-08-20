"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, assetUrl } from "@/lib/api";
import { useStore } from "@/context/store-context";
import type { Address } from "@/lib/types";
import { money, productName } from "@/lib/utils";
import { useLocale } from "@/context/locale-context";
type Payment = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
};
export default function Checkout() {
  const { token, cart, refreshCart } = useStore();
  const { dictionary: d } = useLocale();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!token) {
      router.replace("/login?next=/checkout");
      return;
    }
    Promise.all([
      api<Address[]>("/addresses", {}, token),
      api<{ payment_methods: Payment[] }>("/payment-method"),
    ])
      .then(([a, p]) => {
        setAddresses(a);
        setPayments(p.payment_methods || []);
      })
      .catch((e) => setError(e.message));
  }, [token, router]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const d = new FormData(e.currentTarget);
    try {
      const result = await api<{ order_id: number; link?: string }>(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify({
            address_id: Number(d.get("address_id")),
            payment_method_id: Number(d.get("payment_method_id")),
            notes: d.get("notes") || null,
            wallet_number: d.get("wallet_number") || null,
          }),
        },
        token,
      );
      await refreshCart();
      if (result.link) window.location.href = result.link;
      else router.push(`/account/orders?placed=${result.order_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }
  if (!cart?.items.length)
    return (
      <div className="page-shell empty-state">
        <h1>{d.checkout.empty}</h1>
      </div>
    );
  return (
    <div className="page-shell checkout-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">{d.checkout.almost}</span>
          <h1>{d.checkout.title}</h1>
        </div>
        <span>{d.checkout.secureOrder}</span>
      </div>
      <form onSubmit={submit} className="checkout-layout">
        <div className="checkout-form">
          <section>
            <h2>1. {d.checkout.address}</h2>
            {addresses.length ? (
              <div className="choice-list">
                {addresses.map((a) => (
                  <label key={a.id}>
                    <input
                      type="radio"
                      name="address_id"
                      value={a.id}
                      defaultChecked={a.is_default}
                      required
                    />
                    <span>
                      <b>{a.name}</b>
                      {a.address}
                      <small>{a.phone}</small>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="inline-empty">
                <p>{d.checkout.needAddress}</p>
                <a href="/account/addresses">{d.checkout.addAddress}</a>
              </div>
            )}
          </section>
          <section>
            <h2>2. {d.checkout.payment}</h2>
            <div className="choice-list payment-list">
              {payments.map((p) => (
                <label key={p.id}>
                  <input
                    type="radio"
                    name="payment_method_id"
                    value={p.id}
                    required
                  />
                  <span>
                    {p.icon && <img src={p.icon} alt="" />}
                    <b>{p.name}</b>
                    <small>{p.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h2>3. {d.checkout.note}</h2>
            <textarea
              name="notes"
              maxLength={255}
              placeholder={d.checkout.notePlaceholder}
            />
          </section>
          {error && <p className="form-error">{error}</p>}
        </div>
        <aside className="summary checkout-summary">
          <span className="eyebrow">{d.checkout.inBag}</span>
          {cart.items.map((i) => (
            <div className="mini-item" key={i.id}>
              <img src={assetUrl(i.product.image)} alt="" />
              <span>
                <b>{productName(i.product)}</b>
                <small>
                  {d.checkout.qty} {i.quantity}
                </small>
              </span>
              <strong>
                {money(
                  Number(i.product.discount_price || i.product.price) *
                    i.quantity,
                )}
              </strong>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <span>{d.checkout.beforeDelivery}</span>
            <b>{money(cart.pricing.total_price_after_discount)}</b>
          </div>
          <button disabled={busy || !addresses.length} className="button full">
            {busy ? d.checkout.placing : d.checkout.placeOrder}
          </button>
        </aside>
      </form>
    </div>
  );
}
