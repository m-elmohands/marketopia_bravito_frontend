"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import type { CartData, User } from "@/lib/types";
import { useLocale } from "@/context/locale-context";

type StoreContextValue = {
  token: string | null;
  user: User | null;
  cart: CartData | null;
  cartCount: number;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (
    productId: number,
    quantity?: number,
    attributes?: number[],
  ) => Promise<void>;
};
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      setCart(await api<CartData>("/carts", {}, token, locale));
    } catch {
      setCart(null);
    }
  }, [token, locale]);
  useEffect(() => {
    const saved = localStorage.getItem("bravito_token");
    if (!saved) {
      setLoading(false);
      return;
    }
    setToken(saved);
    api<User>("/auth/profile", {}, saved, locale)
      .then(setUser)
      .catch(() => localStorage.removeItem("bravito_token"))
      .finally(() => setLoading(false));
  }, [locale]);
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);
  const acceptAuth = (data: { token: string; user: User }) => {
    localStorage.setItem("bravito_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };
  const login = async (identifier: string, password: string) =>
    acceptAuth(
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      }),
    );
  const register = async (data: Record<string, string>) =>
    acceptAuth(
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...data, user_type: "user" }),
      }),
    );
  const logout = () => {
    localStorage.removeItem("bravito_token");
    setToken(null);
    setUser(null);
    setCart(null);
  };
  const addToCart = async (
    productId: number,
    quantity = 1,
    attributes: number[] = [],
  ) => {
    if (!token) throw new Error("Please sign in to add items to your bag.");
    await api(
      "/carts",
      {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          quantity,
          product_attribute_value_ids: attributes,
        }),
      },
      token,
    );
    await refreshCart();
  };
  const value = useMemo(
    () => ({
      token,
      user,
      cart,
      cartCount: cart?.items.reduce((n, x) => n + x.quantity, 0) || 0,
      loading,
      login,
      register,
      logout,
      refreshCart,
      addToCart,
    }),
    [token, user, cart, loading, refreshCart],
  );
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be inside StoreProvider");
  return value;
}
