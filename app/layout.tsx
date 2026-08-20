import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/store-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LocaleProvider } from "@/context/locale-context";
import { getServerLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: {
    default: "Bravito — Everyday, but better",
    template: "%s | Bravito",
  },
  description: "Thoughtfully selected essentials for modern living.",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <LocaleProvider initialLocale={locale}>
          <StoreProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </StoreProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
