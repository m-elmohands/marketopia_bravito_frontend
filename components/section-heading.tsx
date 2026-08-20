import { getServerDictionary, getServerLocale } from "@/i18n/server";

import Link from "next/link";
export async function SectionHeading({
  eyebrow,
  title,
  copy,
  link,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  link?: string;
}) {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {link && (
        <Link className="text-link" href={link}>
          {d.common.viewAll} <span>→</span>
        </Link>
      )}
    </div>
  );
}
