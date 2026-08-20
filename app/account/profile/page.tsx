"use client";
import { useStore } from "@/context/store-context";
import { useLocale } from "@/context/locale-context";
export default function Profile() {
  const { user } = useStore();
  const { dictionary: d } = useLocale();
  return (
    <div className="page-shell simple-page">
      <header>
        <span className="eyebrow">{d.account.yourAccount}</span>
        <h1>{d.account.details}</h1>
      </header>
      <div className="profile-card">
        <div>{user?.name?.slice(0, 1).toUpperCase()}</div>
        <dl>
          <dt>{d.account.name}</dt>
          <dd>{user?.name}</dd>
          <dt>{d.account.email}</dt>
          <dd>{user?.email || "—"}</dd>
          <dt>{d.account.phone}</dt>
          <dd>{user?.phone || "—"}</dd>
        </dl>
      </div>
    </div>
  );
}
