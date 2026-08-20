export type ApiResponse<T> = {
  message: string;
  status: number;
  success: boolean;
  data: T;
  error?: unknown;
};
export type Product = {
  id: number;
  name?: string;
  name_en?: string;
  name_ar?: string;
  slug?: string;
  description?: string;
  price: number | string;
  discount_price?: number | string | null;
  quantity?: number;
  max_order_quantity?: number | null;
  image?: string;
  images?: string[];
  rate?: number;
  category_id?: number;
  brand_id?: number;
  attributes?: ProductAttribute[];
};
export type ProductAttribute = {
  id: number;
  name: string;
  values: {
    id: number;
    name: string;
    price: number | string;
    product_attribute_value_id: number;
  }[];
};
export type Category = {
  id: number;
  name?: string;
  name_en?: string;
  name_ar?: string;
  slug?: string;
  image?: string;
  children?: Category[];
};
export type Banner = {
  id: number;
  image?: string;
  title?: string;
  title_en?: string;
  description?: string;
  link?: string;
};
export type Brand = {
  id: number;
  name?: string;
  name_en?: string;
  logo?: string;
  image?: string;
};
export type User = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
};
export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
  product_attribute_values?: {
    id: number;
    price?: number;
    attribute_value?: { value: string };
  }[];
};
export type CartData = {
  items: CartItem[];
  pricing: {
    total_price: number;
    discount: number;
    total_price_after_discount: number;
  };
};
export type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  next_page_url?: string | null;
};
export type City = {
  id: number;
  name?: string;
  name_en?: string;
  min_price?: number;
  areas?: { id: number; name?: string; price?: number }[];
};
export type Address = {
  id: number;
  name: "home" | "work" | "other";
  address: string;
  phone: string;
  lat: number;
  lng: number;
  is_default: boolean;
  city_id: number;
  city?: City;
};
