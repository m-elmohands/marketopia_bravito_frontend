import { safeApi } from "@/lib/api";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
type Faq = {
  id: number;
  question?: string;
  question_en?: string;
  answer?: string;
  answer_en?: string;
  category?: string | null;
};
type FaqResponse = { faqs: Faq[]; grouped_by_category?: Record<string, Faq[]> };
export default async function FAQ() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const response = await safeApi<FaqResponse | Faq[]>(
    "/faqs",
    { faqs: [] },
    locale,
  );
  const faqs = Array.isArray(response) ? response : response.faqs || [];
  const groups = faqs.reduce<Record<string, Faq[]>>((result, faq) => {
    const category = faq.category || "General";
    (result[category] ||= []).push(faq);
    return result;
  }, {});
  return (
    <div className="page-shell simple-page">
      <header>
        <span className="eyebrow">{d.content.faqEyebrow}</span>
        <h1>{d.content.faqTitle}</h1>
      </header>
      <div className="faq-list">
        {Object.entries(groups).map(([category, items]) => (
          <section className="faq-group" key={category}>
            {Object.keys(groups).length > 1 && <h2>{category}</h2>}
            {items.map((faq, index) => (
              <details key={faq.id} open={index === 0}>
                <summary>
                  {faq.question || faq.question_en}
                  <span>+</span>
                </summary>
                <div
                  dangerouslySetInnerHTML={{
                    __html: faq.answer || faq.answer_en || "",
                  }}
                />
              </details>
            ))}
          </section>
        ))}
        {!faqs.length && <p>{d.content.faqEmpty}</p>}
      </div>
    </div>
  );
}
