import { safeApi } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
type Section = {
  id: number;
  title?: string;
  title_en?: string;
  content?: string;
  description?: string;
};
export default async function About() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const sections = await safeApi<Section[]>("/about-sections", [], locale);
  return (
    <div className="editorial-page">
      <header>
        <span className="eyebrow">{d.content.about}</span>
        <h1>{d.content.aboutTitle}</h1>
        <p>{d.content.aboutCopy}</p>
      </header>
      <div className="manifesto">
        <span>01</span>
        <h2>{d.content.manifesto}</h2>
      </div>
      <div className="editorial-sections">
        {sections.length ? (
          sections.map((s, i) => (
            <section key={s.id}>
              <span>0{i + 2}</span>
              <div>
                <h2>{s.title || s.title_en}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: s.content || s.description || "",
                  }}
                />
              </div>
            </section>
          ))
        ) : (
          <>
            <section>
              <span>02</span>
              <div>
                <h2>{d.content.curiosity}</h2>
                <p>{d.content.curiosityCopy}</p>
              </div>
            </section>
            <section>
              <span>03</span>
              <div>
                <h2>{d.content.realLife}</h2>
                <p>{d.content.realLifeCopy}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
