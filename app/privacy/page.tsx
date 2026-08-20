import { safeApi } from "@/lib/api";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
export default async function Privacy() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const pages = await safeApi<any[]>("/privacy-policies", [], locale);
  return (
    <div className="page-shell policy-page">
      <span className="eyebrow">{d.content.privacyEyebrow}</span>
      <h1>{d.content.privacyTitle}</h1>
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
