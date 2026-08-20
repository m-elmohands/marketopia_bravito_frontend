import Link from "next/link";
import { assetUrl, safeApi } from "@/lib/api";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
type Post = {
  id: number;
  slug: string;
  title?: string;
  title_en?: string;
  excerpt?: string;
  image?: string;
  featured_image?: string;
  featured_image_url?: string;
  published_at?: string;
};
type PostsResponse = {
  data: Post[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
export default async function Journal() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const response = await safeApi<PostsResponse | Post[]>(
    "/blog-posts",
    {
      data: [],
      pagination: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    },
    locale,
  );
  const posts = Array.isArray(response) ? response : response.data;
  return (
    <div className="page-shell journal">
      <header>
        <span className="eyebrow">{d.content.journalEyebrow}</span>
        <h1>{d.content.journalTitle}</h1>
        <p>{d.content.journalCopy}</p>
      </header>
      <div className="journal-grid">
        {posts.map((p, i) => (
          <Link
            className={i === 0 ? "journal-card featured" : "journal-card"}
            href={`/journal/${p.slug}`}
            key={p.id}
          >
            <img
              src={assetUrl(
                p.featured_image_url || p.featured_image || p.image,
              )}
              alt=""
            />
            <span>
              {p.published_at
                ? new Date(p.published_at).toLocaleDateString("en-EG", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Bravito journal"}
            </span>
            <h2>{p.title || p.title_en}</h2>
            <p>{p.excerpt}</p>
          </Link>
        ))}
      </div>
      {!posts.length && (
        <div className="empty-state">
          <h2>{d.content.storiesSoon}</h2>
          <p>{d.content.storiesCopy}</p>
        </div>
      )}
    </div>
  );
}
