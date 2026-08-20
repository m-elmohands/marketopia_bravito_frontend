import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { assetUrl, safeApi } from "@/lib/api";
import type { Banner, Brand, Category, Product } from "@/lib/types";
import { asArray } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getServerDictionary, getServerLocale } from "@/i18n/server";
import type { Dictionary } from "@/i18n/dictionaries";

export default async function Home() {
  const locale = await getServerLocale();
  const d = await getServerDictionary();
  const [banners, categories, products, brands] = await Promise.all([
    safeApi<Banner[]>("/home/banners", [], locale),
    safeApi<Category[]>("/home/categories", [], locale),
    safeApi<Product[]>("/home/products", [], locale),
    safeApi<Brand[]>("/home/brands", [], locale),
  ]);
  const hero = asArray(banners)[0];
  const cats = asArray(categories);
  const picks = asArray(products).slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{d.home.eyebrow}</span>
          <h1>
            {d.home.title}
            <br />
            <em>{d.home.titleAccent}</em>
          </h1>
          <p>{d.home.heroCopy}</p>
          <div className="hero-actions">
            <Link className="button" href="/shop">
              {d.home.shopCollection} <ArrowRightIcon />
            </Link>
            <Link className="button button-ghost" href="/about">
              {d.home.why}
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={assetUrl(
              hero?.image || "banners/01KMWSNKB2CQEG3QJ3R3N8MSXV.jpg",
            )}
            alt="Bravito seasonal collection"
          />
          <div className="hero-note">
            <span>01</span>
            <p>{d.home.heroNote}</p>
          </div>
        </div>
      </section>
      <section className="trust-row">
        <div>
          <SparklesIcon />
          <span>
            <b>{d.home.curated}</b>
            {d.home.curatedCopy}
          </span>
        </div>
        <div>
          <TruckIcon />
          <span>
            <b>{d.home.delivered}</b>
            {d.home.deliveredCopy}
          </span>
        </div>
        <div>
          <ShieldCheckIcon />
          <span>
            <b>{d.home.lasting}</b>
            {d.home.lastingCopy}
          </span>
        </div>
      </section>
      {cats.length > 0 && (
        <section className="section">
          <SectionHeading
            eyebrow={d.home.find}
            title={d.home.categories}
            copy={d.home.categoriesCopy}
          />
          <div className="category-grid">
            {cats.slice(0, 4).map((c, i) => (
              <Link
                className={`category-card category-${i + 1}`}
                href={`/shop?category=${c.id}`}
                key={c.id}
              >
                <img
                  src={assetUrl(c.image)}
                  alt={c.name || c.name_en || d.home.category}
                />
                <div>
                  <span>0{i + 1}</span>
                  <h3>{c.name || c.name_en || c.name_ar}</h3>
                  <p>
                    {d.home.explore} <ArrowRightIcon />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="section products-section">
        <SectionHeading
          eyebrow={d.home.edit}
          title={d.home.worth}
          copy={d.home.worthCopy}
          link="/shop"
        />
        <div className="product-grid">
          {picks.length ? (
            picks.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <EmptyCatalog d={d} />
          )}
        </div>
      </section>
      <section className="story-band">
        <div className="story-art">
          <div className="story-circle">B</div>
          <span>
            {d.home.storyBandTitle}
            <br />
            {d.home.storyBandCopy}
          </span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">{d.home.quiet}</span>
          <h2>{d.home.storyTitle}</h2>
          <p>{d.home.storyCopy}</p>
          <Link className="text-link light" href="/about">
            {d.home.readStory} <span>→</span>
          </Link>
        </div>
      </section>
      {asArray(brands).length > 0 && (
        <section className="brand-strip">
          <span>{d.home.company}</span>
          {asArray(brands)
            .slice(0, 7)
            .map((b) => (
              <strong key={b.id}>{b.name || b.name_en || d.home.brand}</strong>
            ))}
        </section>
      )}
    </>
  );
}
function EmptyCatalog({ d }: { d: Dictionary }) {
  return (
    <div className="empty-catalog">
      <span>{d.home.empty}</span>
      <p>{d.home.emptyCopy}</p>
    </div>
  );
}
