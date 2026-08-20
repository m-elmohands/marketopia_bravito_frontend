"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/context/locale-context";

export function PaymentResult() {
  const query = useSearchParams();
  const { dictionary: d } = useLocale();
  const pending = query.get("pending") === "1";
  const success = query.get("success") === "1";
  const transactionId = query.get("transaction_id");
  const title = pending
    ? d.payment.pendingTitle
    : success
      ? d.payment.successTitle
      : d.payment.failedTitle;
  const copy = pending
    ? d.payment.pendingCopy
    : success
      ? d.payment.successCopy
      : d.payment.failedCopy;

  return (
    <div className="page-shell empty-state payment-result">
      <span className="eyebrow">{d.payment.eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      {transactionId && (
        <small>
          {d.payment.reference}: {transactionId}
        </small>
      )}
      <div className="hero-actions">
        <Link className="button" href="/account/orders">
          {d.payment.orders}
        </Link>
        <Link className="button button-ghost" href="/shop">
          {d.payment.shop}
        </Link>
      </div>
    </div>
  );
}
