"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useStore } from "@/context/store-context";
import { money } from "@/lib/utils";
import { useLocale } from "@/context/locale-context";
type Order = {
  id: number;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
};
export default function Orders() {
  const { token } = useStore();
  const { locale, dictionary: d } = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token)
      api<{ data: Order[] } | Order[]>("/orders?per_page=50", {}, token)
        .then((x) => setOrders(Array.isArray(x) ? x : x.data))
        .finally(() => setLoading(false));
    else setLoading(false);
  }, [token, locale]);
  return (
    <div className="page-shell simple-page">
      <header>
        <span className="eyebrow">{d.account.yourAccount}</span>
        <h1>{d.account.orders}</h1>
      </header>
      {loading ? (
        <p>{d.account.loadingOrders}</p>
      ) : orders.length ? (
        <div className="order-list">
          {orders.map((o) => (
            <article key={o.id}>
              <div>
                <span>
                  {d.account.order} #{o.id}
                </span>
                <small>
                  {new Date(o.created_at).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-EG",
                    {
                      dateStyle: "medium",
                    },
                  )}
                </small>
              </div>
              <div>
                <span className="order-status">
                  {o.status.replaceAll("_", " ")}
                </span>
                <b>{money(o.total)}</b>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{d.account.noOrders}</h2>
          <p>{d.account.noOrdersCopy}</p>
          <Link className="button" href="/shop">
            {d.account.startExploring}
          </Link>
        </div>
      )}
    </div>
  );
}
