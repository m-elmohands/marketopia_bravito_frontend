import { safeApi } from "@/lib/api";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
type Page = {
  id: number;
  title?: string;
  content?: string;
  description?: string;
};
export default async function Shipping() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const pages = await safeApi<Page[]>("/shipping-returns", [], locale);
  return (
    <div className="page-shell policy-page">
      <span className="eyebrow">{d.content.shippingEyebrow}</span>
      <h1>{d.content.shippingTitle}</h1>
      {pages.map((p) => (
        <section key={p.id}>
          <h2>{p.title}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: p.content || p.description || "",
            }}
          />
        </section>
      ))}
    </div>
  );
}
