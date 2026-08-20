"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/store-context";
import {
  ArrowRightIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLocale } from "@/context/locale-context";
export default function Account() {
  const { user, loading, logout } = useStore();
  const { dictionary: d } = useLocale();
  const router = useRouter();
  if (loading)
    return <div className="page-shell loading">{d.account.loading}</div>;
  if (!user) {
    router.replace("/login");
    return null;
  }
  return (
    <div className="page-shell account-page">
      <div className="account-hello">
        <span className="eyebrow">{d.account.eyebrow}</span>
        <h1>
          {d.account.hello}, {user.name.split(" ")[0]}.
        </h1>
        <p>{d.account.copy}</p>
      </div>
      <div className="account-grid">
        <Link href="/account/orders">
          <ShoppingBagIcon />
          <div>
            <h2>{d.account.orders}</h2>
            <p>{d.account.ordersCopy}</p>
          </div>
          <ArrowRightIcon />
        </Link>
        <Link href="/account/addresses">
          <MapPinIcon />
          <div>
            <h2>{d.account.addresses}</h2>
            <p>{d.account.addressesCopy}</p>
          </div>
          <ArrowRightIcon />
        </Link>
        <Link href="/account/profile">
          <UserCircleIcon />
          <div>
            <h2>{d.account.details}</h2>
            <p>{user.email || user.phone}</p>
          </div>
          <ArrowRightIcon />
        </Link>
      </div>
      <button
        className="text-button"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        {d.account.signOut}
      </button>
    </div>
  );
}
