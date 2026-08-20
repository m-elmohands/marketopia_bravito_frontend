import { safeApi } from "@/lib/api";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
export default async function Terms() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const pages = await safeApi<any[]>("/terms-of-services", [], locale);
  return (
    <div className="page-shell policy-page">
      <span className="eyebrow">{d.content.termsEyebrow}</span>
      <h1>{d.content.termsTitle}</h1>
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
