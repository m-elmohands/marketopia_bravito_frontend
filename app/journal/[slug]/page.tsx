import { api, assetUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
type Post = {
  slug?: string;
  title?: string;
  title_en?: string;
  content?: string;
  body?: string;
  image?: string;
  featured_image?: string;
  featured_image_url?: string;
  published_at?: string;
};

type PostsResponse = {
  data: Post[];
};

export async function generateStaticParams() {
  const response = await api<PostsResponse | Post[]>(
    "/blog-posts?per_page=1000",
  );
  const posts = Array.isArray(response) ? response : response.data;

  return posts
    .filter((post): post is Post & { slug: string } => Boolean(post.slug))
    .map((post) => ({ slug: post.slug }));
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  let post: Post;
  try {
    post = await api(`/blog-posts/${(await params).slug}`, {}, null, locale);
  } catch {
    notFound();
  }
  const hero = post!.featured_image_url || post!.featured_image || post!.image;
  return (
    <article className="article-page">
      <header>
        <span className="eyebrow">{d.content.journalLabel}</span>
        <h1>{post!.title || post!.title_en}</h1>
        {post!.published_at && (
          <time>
            {new Date(post!.published_at).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-EG",
              {
                dateStyle: "long",
              },
            )}
          </time>
        )}
      </header>
      {hero && <img className="article-hero" src={assetUrl(hero)} alt="" />}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post!.content || post!.body || "" }}
      />
    </article>
  );
}
