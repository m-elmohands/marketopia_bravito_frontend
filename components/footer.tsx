"use client";
import Link from "next/link";
import { useLocale } from "@/context/locale-context";
import Logo from "./logo";
export function Footer() {
  const { dictionary: d } = useLocale();
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo />
          <p>{d.footer.intro}</p>
        </div>
        <div>
          <h4>{d.footer.explore}</h4>
          <Link href="/shop">{d.footer.allProducts}</Link>
          <Link href="/about">{d.common.story}</Link>
          <Link href="/journal">{d.common.journal}</Link>
        </div>
        <div>
          <h4>{d.footer.help}</h4>
          <Link href="/contact">{d.common.contact}</Link>
          <Link href="/shipping">{d.footer.shipping}</Link>
          <Link href="/faq">{d.footer.faq}</Link>
        </div>
        <div>
          <h4>{d.footer.newsletterTitle}</h4>
          <p>{d.footer.newsletterCopy}</p>
          <form className="newsletter">
            <input
              type="email"
              aria-label="Email"
              placeholder={d.footer.email}
            />
            <button>{d.footer.join}</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bravito</span>
        <div>
          <Link href="/privacy">{d.footer.privacy}</Link>
          <Link href="/terms">{d.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
