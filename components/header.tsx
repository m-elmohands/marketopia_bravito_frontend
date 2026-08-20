"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useStore } from "@/context/store-context";
import { useLocale } from "@/context/locale-context";
import Logo from "./logo";

export function Header() {
  const pathname = usePathname();
  const { cartCount, user } = useStore();
  const { locale, setLocale, dictionary: d } = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const links = [
    { href: "/shop", label: d.common.shop },
    { href: "/about", label: d.common.story },
    { href: "/journal", label: d.common.journal },
    { href: "/contact", label: d.common.contact },
  ];
  return (
    <>
      <div className="announcement">{d.announcement}</div>
      <header className="header">
        <div className="nav-shell">
          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <XMarkIcon /> : <Bars3Icon />}
          </button>
          <Logo />
          <nav className={open ? "nav-links open" : "nav-links"}>
            {links.map((item) => (
              <Link
                className={pathname === item.href ? "active" : ""}
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="language-switch"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              aria-label="Change language"
            >
              {locale === "en" ? "ع" : "EN"}
            </button>
            <button
              className="icon-btn desktop-only"
              onClick={() => setSearch(!search)}
              aria-label={d.common.search}
            >
              <MagnifyingGlassIcon />
            </button>
            <Link
              className="icon-btn"
              href={user ? "/account" : "/login"}
              aria-label={d.common.account}
            >
              <UserIcon />
            </Link>
            <Link
              className="icon-btn bag-link"
              href="/cart"
              aria-label={d.common.cart}
            >
              <ShoppingBagIcon />
              {cartCount > 0 && <b>{cartCount}</b>}
            </Link>
          </div>
        </div>
        {search && (
          <form className="search-bar" action="/shop">
            <MagnifyingGlassIcon />
            <input
              autoFocus
              name="search"
              placeholder={`${d.common.search}…`}
            />
            <button>{d.common.search}</button>
          </form>
        )}
      </header>
    </>
  );
}
