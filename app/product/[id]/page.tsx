import { ProductDetails } from "@/components/product-details";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/i18n/server";

type ProductsResponse = {
  data: Product[];
};

export async function generateStaticParams() {
  const response = await api<ProductsResponse | Product[]>(
    "/products?per_page=1000",
  );
  const products = Array.isArray(response) ? response : response.data;

  return products.map((product) => ({ id: String(product.id) }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await getServerLocale();
  const { id } = await params;
  let product: Product;
  try {
    product = await api(`/products/details/${id}`, {}, null, locale);
  } catch {
    notFound();
  }
  return <ProductDetails product={product!} />;
}
